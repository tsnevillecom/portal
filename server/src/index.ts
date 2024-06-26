import mongoose from 'mongoose'
import AuthRouter from './routers/auth.router'
import GoogleRouter from './routers/google.router'
import RegisterRouter from './routers/register.router'
import ResetRouter from './routers/reset.router'
import ChannelsRouter from './routers/channels.router'
import VerifyRouter from './routers/verify.router'
import Server from './server'
import MessagesRouter from './routers/messages.router'
import UsersRouter from './routers/users.router'
import CompaniessRouter from './routers/companies.router'
import LocationsRouter from './routers/locations.router'

const server = new Server([
  { path: '/auth', routerClass: new AuthRouter() },
  { path: '/register', routerClass: new RegisterRouter() },
  { path: '/verify', routerClass: new VerifyRouter() },
  { path: '/channels', routerClass: new ChannelsRouter() },
  { path: '/companies', routerClass: new CompaniessRouter() },
  { path: '/messages', routerClass: new MessagesRouter() },
  { path: '/locations', routerClass: new LocationsRouter() },
  { path: '/google', routerClass: new GoogleRouter() },
  { path: '/reset', routerClass: new ResetRouter() },
  { path: '/users', routerClass: new UsersRouter() },
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
