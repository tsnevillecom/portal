import LogEventsMiddleware from './logEvents.middleware'

class ErrorHandler {
  public logEvents = new LogEventsMiddleware().logEvents

  public errorHandler = (err, req, res, next) => {
    this.logEvents(`${err.name}: ${err.message}`, 'errLog.txt')
    console.error(err.stack)
    res.status(500).send(err.message)
  }
}

export default ErrorHandler
