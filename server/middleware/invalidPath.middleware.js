const invalidPathHandler = (request, response, next) => {
  response.status(404)
  response.send({ message: 'invalid path' })
}

module.exports = invalidPathHandler
