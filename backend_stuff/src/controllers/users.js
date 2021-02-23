const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('notes', { content: 1, date: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  const body = request.body

  const e = new Error()
  e.name = 'PasswordValidationError'

  if (!body.password) {
    e.message = '`password` is required.'
    throw e
  }
  // Error checking has to happen here as well *(1)

  // TODO: enforce passwords to be stronger (mix of special characters)

  const whiteSpace = /^.*\s+.*$/
  const between8and25characters = /^.{8,25}$/

  if (whiteSpace.test(body.password)) {
    e.message = '`password` must not contain any whitespace.'
    throw e
  } else if (!between8and25characters.test(body.password)) {
    e.message = '`password` must be between 8 and 25 characters in length.'
    throw e
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter


/////////// Comment expansions ///////////

// (1)
// This cannot be handled by our database schema because we are only storing
// password hashes back there. As a result we are left with two places we can
// verify password requirements- frontend and backend. Along with handling this
// at the frontend, we need to make sure people cannot do custom POST requests
// using invalid passwords. Hence, we need to handle it here at the backend as
// well. We're throwing errors in this method so that it gets picked up by our
// error handling middleware.