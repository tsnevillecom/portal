import path from 'path'

class InvalidPathMiddleware {
  public sendError = (request, response, next) => {
    response.status(404)
    response.sendFile(path.join(__dirname, '../public', 'index.html'))
  }
}

export default InvalidPathMiddleware
