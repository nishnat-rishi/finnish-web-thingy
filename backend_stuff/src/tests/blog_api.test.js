const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

const jwt = require('jsonwebtoken')

const api = supertest(app)


describe('NON_DELETIONS', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const luke = await api
      .post('/api/users')
      .send(helper.initialUsers[0])

    const root = await api
      .post('/api/users')
      .send(helper.initialUsers[1])

    for (let blog of helper.initialBlogs) {
      await (new Blog({
        ...blog,
        user: luke.id // every blog is luke's blog
      })).save()
    }
  })

  describe('GET', () => {
    test('blogs in JSON format', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('correct amount of blogs', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('blogs contain key `id`', async () => {
      const response = await api.get('/api/blogs')
      response.body.forEach(blog => expect(blog.id).toBeDefined())
    })
  })

  describe('POST', () => {
    test('with correct token creates a new blog post successfully', async() => {
      const newBlog = {
        author: 'Chili',
        title: 'Proper Nice',
        url: 'chilli.com',
        likes: 423
      }

      const lukeResponse =  await api
        .post('/api/login')
        .send(helper.initialUsers[0])
        .expect(201)

      const token = lukeResponse.body.token

      const blogsAtStart = await helper.blogsInDb()

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
      expect(blogsAtEnd.map(blog => blog.title)).toContain(newBlog.title)
    })

    test('with invalid token returns 400 (Bad Request)', async() => {
      const newBlog = {
        author: 'Chili',
        title: 'Proper Nice',
        url: 'chilli.com',
        likes: 423
      }

      const token = 'this_is_an_invalid_token'

      const blogsAtStart = await helper.blogsInDb()

      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    })

    test('with missing likes defaults to having 0 likes', async() => {
      const newBlog = {
        author: 'Chili',
        title: 'Proper Nice',
        url: 'chilli.com',
      }

      const lukeResponse =  await api
        .post('/api/login')
        .send(helper.initialUsers[0])

      const token = lukeResponse.body.token

      await api.post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)

      const blogsAtEnd = await helper.blogsInDb()

      const blogInDb = blogsAtEnd.find(blog => blog.title === newBlog.title)

      expect(blogInDb.likes).toBeDefined()
      expect(blogInDb.likes).toBe(0)
    })

    test('with missing `title` and `url` gives 400 (Bad Request)', async() => {
      const missingTitleBlog = {
        author: 'Chili',
        url: 'chilli.com',
      }

      const lukeResponse =  await api
        .post('/api/login')
        .send(helper.initialUsers[0])

      const token = lukeResponse.body.token

      await api
        .post('/api/blogs')
        .send(missingTitleBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)

      const missingUrlBlog = {
        author: 'Chili',
        title: 'Proper Nice',
      }

      await api
        .post('/api/blogs')
        .send(missingUrlBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })
  })

  describe('PUT', () => {
    test('updates information correctly', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const firstBlog = blogsAtStart[0]
      let updatedBlog = { ...firstBlog, likes: firstBlog.likes + 1 }

      await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      updatedBlog = blogsAtEnd[0]

      expect(updatedBlog.likes).toBe(firstBlog.likes + 1)
    })

    // test('with invalid id returns 400 (Bad Request)', async () => {
    //   const blogsAtStart = await helper.blogsInDb()
    //   const firstBlog = blogsAtStart[0]
    //   let updatedBlog = { ...firstBlog, likes: firstBlog.likes + 1 }

    //   await api
    //     .put('/api/blogs/L02LOL')
    //     .send(updatedBlog)
    //     .expect(400)
    // })

    // test.only('with absent id returns 400 (Bad Request)', async () => {
    //   const blogsAtStart = await helper.blogsInDb()
    //   const firstBlog = blogsAtStart[0]

    //   const absentId = await helper.nonExistingId()
    //   let updatedBlog = { ...firstBlog, likes: firstBlog.likes + 1 }

    //   await api
    //     .put(`/api/blogs/${absentId}`)
    //     .send(firstBlog)
    //     .expect(400)

    //   // const blogsAtEnd = await helper.blogsInDb()
    //   // updatedBlog = blogsAtEnd[0]

    //   // expect(updatedBlog.likes).toBe(firstBlog.likes)
    // })

  })
})

describe('DELETE', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    for (let user of helper.initialUsers) {
      await api
        .post('/api/users')
        .send(user)
    }

    const lukeResponse = await api
      .post('/api/login')
      .send(helper.initialUsers[0])

    const token = lukeResponse.body.token

    for (let blog of helper.initialBlogs) {

      await api
        .post('/api/blogs')
        .send(blog)
        .set('Authorization', `Bearer ${token}`)

      // await (new Blog({
      //   ...blog,
      //   user: luke.id // every blog is luke's blog
      // })).save()
    }
  })

  test('on incorrect token gives 401 (Unauthorized)', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const firstBlog = blogsAtStart[0] // this isn't root's blog

    const rootResponse =  await api
      .post('/api/login')
      .send(helper.initialUsers[1])
      .expect(201)

    const token = rootResponse.body.token

    await api
      .delete(`/api/blogs/${firstBlog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd.length).toBe(blogsAtStart.length)
  })

  test('on invalid token gives 400 (Bad Request)', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const firstBlog = blogsAtStart[0]

    const token = 'complete_gibberish'

    await api
      .delete(`/api/blogs/${firstBlog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd.length).toBe(blogsAtStart.length)
  })

  test('on correct token and correct id deletes note with 204 (No Content)', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const firstBlog = blogsAtStart[0] // this is luke's blog

    const lukeResponse =  await api
      .post('/api/login')
      .send(helper.initialUsers[0])
      .expect(201)

    const token = lukeResponse.body.token

    await api
      .delete(`/api/blogs/${firstBlog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })

  test('on valid absent id gives 404 (Not Found)', async () => {
    const blogsAtStart = helper.blogsInDb()

    const nonExistingId = await helper.nonExistingId()

    const lukeResponse =  await api
      .post('/api/login')
      .send(helper.initialUsers[0])
      .expect(201)

    const token = lukeResponse.body.token

    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)

    const blogsAtEnd = helper.blogsInDb()

    expect(blogsAtEnd.length).toBe(blogsAtStart.length)
  })

  test('on invalid id gives 400 (Bad Request)', async () => {
    const invalidId = 'LOL5252'

    const lukeResponse =  await api
      .post('/api/login')
      .send(helper.initialUsers[0])
      .expect(201)

    const token = lukeResponse.body.token

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `Beraer ${token}`)
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})