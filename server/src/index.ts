import mongoose from 'mongoose'
import AuthRouter from './routers/auth.router'
import GoogleRouter from './routers/google.router'
import RegisterRouter from './routers/register.router'
import ResetRouter from './routers/reset.router'
import ChannelsRouter from './routers/channels.router'
import VerifyRouter from './routers/verify.router'
import Server from './server'

const server = new Server([
  { path: '/auth', routerClass: new AuthRouter() },
  { path: '/register', routerClass: new RegisterRouter() },
  { path: '/verify', routerClass: new VerifyRouter() },
  { path: '/channels', routerClass: new ChannelsRouter() },
  { path: '/google', routerClass: new GoogleRouter() },
  { path: '/reset', routerClass: new ResetRouter() },
])

server.initialize().then(() => {
  server.listen()
})

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination')
    process.exit(0)
  })
})
