import { Server as SocketIOServer } from 'socket.io'
import { createServer, Server as HTTPServer } from 'http'
import config from './config'
import cookieParser from 'cookie-parser'
import express, { Application as ExpressApplication } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import connectDatabase from './db'
import corsOptions from './config/corsOptions'
import limiter from 'express-rate-limit'
import path from 'path'
import CredentialsMiddleware from './middleware/credentials.middleware'
import InvalidPathMiddleware from './middleware/invalidPath.middleware'
import UsersSeed from './seed/users.seed'
import ChannelsSeed from './seed/channels.seed'
import jwt from 'jsonwebtoken'
import ChannelsController from './controllers/channels.controller'
import Channel from './models/channel'

class Server {
  private port: number
  private host: string
  private env: string

  private app: ExpressApplication
  private httpServer: HTTPServer
  public io: SocketIOServer

  private validateCredentials = new CredentialsMiddleware().validateCredentials
  private sendInvalidPathError = new InvalidPathMiddleware().sendError

  constructor(routers: any[]) {
    this.port = config.PORT
    this.host = config.HOST
    this.env = process.env.NODE_ENV || 'development'

    this.app = express()
    this.httpServer = createServer(this.app)

    this.registerMiddleware()
    this.registerRouters(routers)
  }

  public async initialize() {
    connectDatabase()
    await this.seed()
    this.initializeSocket()
  }

  public async initializeSocket() {
    this.io = new SocketIOServer(this.httpServer, {
      pingInterval: 10000,
      pingTimeout: 30000,
    })
    this.handleSocketConnection()
  }

  private seed(): Promise<any> {
    const db = mongoose.connection

    return new Promise((resolve) => {
      db.once('open', async () => {
        await new UsersSeed().seed()
        await new ChannelsSeed().seed()
        resolve(null)
      })
    })
  }

  private handleSocketConnection(): void {
    this.io.sockets.on('connection', (socket) => {
      console.log('Socket connected:', socket.id)

      socket.on('join_channels', async ({ accessToken }) => {
        let user = null

        jwt.verify(
          accessToken,
          config.ACCESS_TOKEN_SECRET,
          async (err, decoded) => {
            if (err || !decoded?.user) {
              console.log(err ? 'invalid accessToken' : 'no user found')
              socket.emit('user_joined', { joined: false, channels: [] })
              return
            }

            user = decoded?.user
            const channels = await Channel.find({
              members: { $in: [user._id] },
            }).distinct('_id')

            socket.join(channels.map((c) => c.toString()))
            socket.emit('user_joined', { joined: true, channels })
          }
        )
      })

      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id)
      })

      socket.on('send_message', ({ message, channel }, callback) => {
        if (callback)
          callback({
            status: 'sent',
            message,
            channel,
          })

        setTimeout(
          () => this.io.in(channel).emit('message', { message, channel }),
          2000
        )
      })
    })
  }

  private registerMiddleware() {
    this.app.use(
      limiter({
        windowMs: 5000,
        max: 100,
      })
    )

    // app.use(logger)
    this.app.use(this.validateCredentials)
    this.app.use(cors(corsOptions))
    this.app.use(cookieParser())
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(express.static(path.join(__dirname, 'client', 'build')))
    this.app.use(express.json())
  }

  private registerRouters(descriptors: any[]) {
    descriptors.forEach((descriptor) => {
      this.app.use(descriptor.path, descriptor.routerClass.router)
    })

    this.app.use(this.sendInvalidPathError)
  }

  public listen() {
    this.httpServer.listen(this.port, this.host, () => {
      console.log(
        `🚀 App listening on the port http://${this.host}:${this.port}`
      )
    })
  }
}

export default Server
