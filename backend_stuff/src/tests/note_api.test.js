const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const Note = require('../models/note')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  // We have to access the users api to POST a user. This will generate the password
  // hashes we will finally use to compare. But this means there is a dependency of
  // note_api.test.js on user_api.test.js since if we assume those operations work,
  // and they don't, we're out of luck!

  await Note.deleteMany({})
  await User.deleteMany({})

  for (let user of helper.initialUsers) {
    await api
      .post('/api/users')
      .send(user)
  }

  const addedUsers = await User.find({})
  const firstUser = addedUsers[0]

  let note
  for (let noteObj of helper.initialNotes) {
    noteObj.user = firstUser._id
    note = new Note(noteObj)
    await note.save()
  }
})

describe('when there are initially some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)

    expect(contents).toContain(
      'Browser can execute only Javascript'
    )
  })
})

describe('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

    const receivedKeys = []

    for (let k in resultNote.body) {
      if (Object.prototype.hasOwnProperty.call(resultNote.body, k)) {
        receivedKeys.push(k)
      }
    }
    const requiredKeys = []

    for (let k in processedNoteToView) {
      if (Object.prototype.hasOwnProperty.call(processedNoteToView, k)) {
        requiredKeys.push(k)
      }
    }

    expect(requiredKeys).toEqual(receivedKeys)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/notes/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api
      .get(`/api/notes/${invalidId}`)
      .expect(400)
  })
})

describe('addition of a new note', () => {
  test('succeeds with valid data and valid token', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
    }

    const firstUser = helper.initialUsers[0]
    const loginResponse = await api.post('/api/login')
      .send(firstUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(loginResponse.body).toHaveProperty('token')

    const token = loginResponse.body.token

    await api
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)


    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = notesAtEnd.map(n => n.content)
    expect(contents).toContain(
      'async/await simplifies making async calls'
    )
  })

  test('fails with status code 400 if token is invalid', async () => {
    const newNote = {
      important: true
    }

    await api
      .post('/api/notes')
      .set('Authorization', 'Bearer invalidtoken')
      .send(newNote)
      .expect(400)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })

  test('fails with status code 400 if data is invaild', async () => {
    const invalidNote = {
      important: true
    }

    const firstUser = helper.initialUsers[0]
    const loginResponse = await api.post('/api/login')
      .send(firstUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(loginResponse.body).toHaveProperty('token')

    const token = loginResponse.body.token

    await api
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidNote)
      .expect(400)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
  })
})

describe('deletion of a note', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(
      helper.initialNotes.length - 1
    )

    const contents = notesAtEnd.map(r => r.content)

    expect(contents).not.toContain(noteToDelete.content)
  })
})

afterAll(() => {
  mongoose.connection.close()
})