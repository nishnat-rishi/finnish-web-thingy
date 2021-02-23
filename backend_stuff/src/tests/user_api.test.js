const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const bcrypt = require('bcrypt')

const api = supertest(app)

describe('when adding a new user', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    let saltRounds, passwordHash, userToAdd
    for (let user of helper.initialUsers) {
      saltRounds = 10
      passwordHash = await bcrypt.hash(user.password, saltRounds)
      userToAdd = new User({
        username: user.username,
        name: user.name,
        passwordHash
      })
      await userToAdd.save()
    }
  })

  test('valid new user is added and returns 201 (Created) and json', async () => {
    const newUser = {
      username: 'madsmikkelsen4133',
      name: 'Mads Mikkelsen',
      password: '8asdfj2cmaasefe9'
    }

    const usersAtStart = await helper.usersInDb()

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const savedUser = response.body

    expect(savedUser.username).toBe(newUser.username)

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
  })

  test('user with same username is not added and returns 400 (Bad Request)', async () => {
    const newUser = helper.initialUsers[0]

    const usersAtStart = await helper.usersInDb()

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toContain('unique')

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('user with whitespaced password is not added and returns 400 (Bad Request)', async () => {
    const newUser = {
      username: 'madsmikkelsen4133',
      name: 'Mads Mikkelsen',
      password: 'sd89a vas8 ha 9ah'
    }

    const usersAtStart = await helper.usersInDb()

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toContain('whitespace')

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('user with short password (< 3) is not added and returns 400 (Bad Request)', async () => {
    const newUser = {
      username: 'madsmikkelsen4133',
      name: 'Mads Mikkelsen',
      password: 'aa'
    }

    const usersAtStart = await helper.usersInDb()

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toContain('length')

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('user with long password (> 25) is not added and returns 400 (Bad Request)', async () => {
    const newUser = {
      username: 'madsmikkelsen4133',
      name: 'Mads Mikkelsen',
      password: 'kjdfanfefaskfnli9we8fae97f4h3n9rn2398n8nadwh89ha398ajwmd'
    }

    const usersAtStart = await helper.usersInDb()

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toContain('length')

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})