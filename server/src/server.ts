import { Server as SocketIOServer } from 'socket.io'
import { createServer, Server as HTTPServer } from 'http'
import config from './config'
import cookieParser from 'cookie-parser'
import express, { Application as ExpressApplication } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import connectDatabase from './db'
import corsOptions from './config/corsOptions'
import limiter from 'express-rate-limit'
import path from 'path'
import CredentialsMiddleware from './middleware/credentials.middleware'
import InvalidPathMiddleware from './middleware/invalidPath.middleware'
import Channel from './models/channel.model'
import cookie from 'cookie'
import Message from './models/message.model'
import RefreshToken from './models/refreshToken.model'

// sessions
import session from 'express-session'
import { sessions } from './_constants'

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
    this.initializeSocket()
  }

  private async initializeSocket() {
    this.io = new SocketIOServer(this.httpServer, {
      pingInterval: 10000,
      pingTimeout: 30000,
    })
    this.handleSocketConnection()
  }

  private handleSocketConnection(): void {
    this.io.use(async (socket, next) => {
      const handshake = socket.handshake.headers.cookie || ''
      const cookies = cookie.parse(handshake)

      try {
        const refreshToken = cookies?.refreshToken
        const foundToken = await RefreshToken.findOne({
          token: refreshToken,
        }).exec()

        socket['userId'] = foundToken.userId.toString()
        next()
      } catch (e) {
        next(new Error('unknown user'))
      }
    })

    this.io.sockets.on('connection', (socket) => {
      console.log('Socket connected:', socket.id)

      socket.on('join_channels', async () => {
        const channels = await Channel.find({
          members: { $in: [socket['userId']] },
          deleted: false,
        }).distinct('_id')

        socket.join(channels.map((c) => c.toString()))
        socket.emit('user_joined', { joined: true, channels })
      })

      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id)
      })

      socket.on('typing', (data) => {
        socket.to(data.channelId).emit('channel_typing', data)
      })

      socket.on('send_message', async (data, callback) => {
        try {
          const newMessage = new Message({
            ...data,
            createdBy: socket['userId'],
          })
          await newMessage.save()

          if (callback)
            callback({
              status: 'sent',
              message: newMessage,
            })

          this.io.in(data.channelId).emit('new_message', newMessage)
        } catch (error) {
          this.io.in(data.channelId).emit('send_message_failed', { ...data })
        }
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

    this.app.use(
      session({
        secret: config.SESSION_SECRET,
        saveUninitialized: false,
        name: sessions.SESSION_KEY,
        // cookie: {
        //   secure: this.env === 'production' ? config.SECURE_COOKIE : 'auto',
        //   maxAge: config.REFRESH_TOKEN_EXPIRY,
        //   sameSite: this.env === 'production' ? 'none' : 'lax',
        //   httpOnly: true,
        // },
        resave: false,
        rolling: true,
      })
    )

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
