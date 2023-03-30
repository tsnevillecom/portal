// import express, { Application } from 'express'
// import socketIO, { Server as SocketIOServer } from 'socket.io'
// import { createServer, Server as HTTPServer } from 'http'

// export class Server {
//   private httpServer: HTTPServer
//   private app: Application
//   private io: SocketIOServer

//   private readonly DEFAULT_PORT = 5000

//   constructor() {
//     this.initialize()

//     this.handleRoutes()
//     this.handleSocketConnection()
//   }

//   private initialize(): void {
//     this.app = express()
//     this.httpServer = createServer(this.app)
//     this.io = new SocketIOServer(this.httpServer)
//   }

//   private handleRoutes(): void {
//     this.app.get('/', (req, res) => {
//       res.send(`<h1>Hello World</h1>`)
//     })
//   }

//   private handleSocketConnection(): void {
//     this.io.on('connection', (socket) => {
//       console.log('Socket connected.')
//     })
//   }

//   public listen(callback: (port: number) => void): void {
//     this.httpServer.listen(this.DEFAULT_PORT, () => callback(this.DEFAULT_PORT))
//   }
// }

import config from './config'
import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import connectDB from './db'
import corsOptions from './config/corsOptions'
import limiter from 'express-rate-limit'
import path from 'path'
import CredentialsMiddleware from './middleware/credentials.middleware'
import InvalidPathMiddleware from './middleware/invalidPath.middleware'

// import { getOptions } from './helpers/cors.helper'
// import TenantsSeed from './seed/tenants.seed'
// import UsersSeed from './seed/users.seed'
// import CarBrandsSeed from './seed/car-brands.seed'

class Server {
  public app: express.Application
  public port: number
  public host: string
  public env: string
  public validateCredentials = new CredentialsMiddleware().validateCredentials
  public sendInvalidPathError = new InvalidPathMiddleware().sendError

  constructor(routers: any[]) {
    this.app = express()
    this.port = config.PORT
    this.host = config.HOST
    this.env = process.env.NODE_ENV || 'development'

    this.registerMiddleware()
    this.registerRouters(routers)
  }

  public async init() {
    const db = connectDB()

    //seed
    // await new Promise((resolve, reject) => {
    //   db.once('open', async () => {
    //     await new TenantsSeed().seed()
    //     await new UsersSeed().seed()
    //     await new CarBrandsSeed().seed()

    //     resolve(null)
    //   })
    // })
  }

  public listen() {
    this.app.listen(this.port, this.host, () => {
      console.log(
        `🚀 App listening on the port http://${this.host}:${this.port}`
      )
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
}

export default Server
