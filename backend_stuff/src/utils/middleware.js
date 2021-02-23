const _ = require('lodash')
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  const tokens = [
    `${request.method}`,
    `${request.url}`,
    `${request.headers['content-length'] ? request.headers['content-length'] : '-'}`,
    `${_.isEmpty(request.body) ?  '-' : JSON.stringify(request.body)}`,
  ]
  logger.info(tokens.join(' '))
  next()
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {

  logger.error(error.name, error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: '`id` should be a valid id!' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'PasswordValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'LoginError') {
    return response.status(401).send({ error: error.message })
  } else if (error.name === 'TokenError') {
    return response.status(401).send({ error: error.message })
  } else if (error.name === 'DoesNotExistError') {
    return response.status(404).send({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(400).send({ error: error.message })
  }
  // *_Maybe_* it would be nice to have a default handler. Perhaps 204 (No Content)?
  // return response.status(204).end()?
  // Maybe not.
}

module.exports = {
  requestLogger,
  tokenExtractor,
  unknownEndpoint,
  errorHandler
}