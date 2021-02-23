const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')

const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const middleware = require('./utils/middleware')

const app = express()

logger.info('connecting to MongoDB ...')

mongoose.connect(config.BLOGLIST_MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true }
)
  .then(result => {
    logger.info('connected to MongoDB!')
  })
  .catch(error => {
    logger.error('Error:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app