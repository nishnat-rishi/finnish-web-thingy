const Blog = require('../models/blog')
const User = require('../models/user')

const initialUsers = [
  {
    username: 'lukematherson28',
    name: 'Matti Lukkainen',
    password: '324j24jd-sdfas'
  },
  {
    username: 'root',
    name: 'Superuser',
    password: 'f8ds9fc-asd'
  }
]

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    author: 'Me',
    title: 'Also something else!',
    url: 'www.joke.com',
    likes: 245,
  },
  {
    author: 'Anotha',
    title: 'Also something else!',
    url: 'www.joke.com',
    likes: 24,
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ author: '-', title: '-', url: '-' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialUsers, usersInDb,
  initialBlogs, nonExistingId, blogsInDb
}