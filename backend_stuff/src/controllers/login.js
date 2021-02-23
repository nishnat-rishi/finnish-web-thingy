const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// const logger = require('../utils/logger')

loginRouter.post('/', async (request, response, next) => {
  const body = request.body

  const e = new Error()
  e.name = 'LoginError'

  if (!body.username || !body.password) {
    e.message = '`username` and `password` are required fields.'
    throw e
  }

  const user = await User.findOne({ username: body.username })

  if (!user) {
    e.message = 'username is not in the database.'
    throw e
  }

  const passwordCorrect = await bcrypt.compare(body.password, user.passwordHash)

  if (!passwordCorrect) {
    e.message = 'Password is incorrect.'
    throw e
  }

  const tokenInfo = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(tokenInfo, process.env.SECRET)

  const tokenResponse = {
    token,
    username: user.username,
    name: user.name
  }

  response.status(201).json(tokenResponse)
})

module.exports = loginRouter