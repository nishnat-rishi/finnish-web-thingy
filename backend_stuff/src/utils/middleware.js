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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id.' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'PasswordValidationError') {
    // Can be merged with the above *(1)
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'LoginError') {
    return response.status(401).json({ error: error.message })
  } else if (error.name === 'TokenError') {
    return response.status(401).json({ error: error.message })
  }else if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: 'invalid token.' })
  }

  logger.error(error.toString())

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}

////////// Comment expansions //////////

// (1)
// This could be merged with the above validation error.
// The only reason it's separate is because the source of the error
// is different. The error above is generated due to mongoose schema validation
// checks, whereas this error is generated from the notesRouter.post(...) method.
// although technically mongoose is checking these things in the backend and not at
// the db level (perhaps?). Once it's established that there's no fundamental difference
// between the mongoose validation error and a thrown validation error from the
// router handlers, we can easily merge them into one 'ValidationError'.
