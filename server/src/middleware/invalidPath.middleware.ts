class InvalidPathMiddleware {
  public sendError = (request, response, next) => {
    response.status(404)
    response.send({ message: 'invalid path' })
  }
}

export default InvalidPathMiddleware
