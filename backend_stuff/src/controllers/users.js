const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response, next) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, url: 1 })
  response.json(users)
})

userRouter.post('/', async (request, response, next) => {
  const body = request.body

  const e = new Error()
  e.name = 'PasswordValidationError'

  const whiteSpacePresent = /^.*\s+.*$/
  const between3and25characters = /^.{3,25}$/

  if (!body.password) {
    e.message = '`password` is required.'
    throw e
  } else if (whiteSpacePresent.test(body.password)) {
    e.message = '`password` must not contain any whitespace.'
    throw e
  } else if (!between3and25characters.test(body.password)) {
    e.message = '`password` must be between 8 and 25 characters in length.'
    throw e
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

userRouter.delete('/:id', async (request, response, next) => {
  await User.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = userRouter