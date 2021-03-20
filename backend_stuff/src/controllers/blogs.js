const blogRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')

const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response, next) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { content: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  const body = request.body

  const e = new Error()
  e.name = 'TokenError'

  const token = request.token

  if (!token) {
    e.message = 'Token missing.'
    throw e
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!decodedToken || !decodedToken.id) {
    e.message = 'Token invalid.'
    throw e
  }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({ ...body, user: user._id })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog)
  await user.save()

  const createdBlog = await Blog
    .findById(savedBlog.id)
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { content: 1 })

  response.status(201).json(createdBlog)
})

blogRouter.delete('/:id', async (request, response, next) => {
  const e = new Error()

  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    e.name = 'DoesNotExistError'
    e.message = 'Blog does not exist.'
    throw e
  }

  e.name = 'TokenError'
  if (!token || !decodedToken.id) {
    e.message = 'Token missing or invalid.'
    throw e
  } else if (decodedToken.id.toString() !== blog.user.toString()) {
    e.message = 'You are not authorized to delete this blog.'
    throw e
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response, next) => {
  const newBlog = request.body

  const updatedBlog = await Blog
    .findByIdAndUpdate(
      request.params.id,
      newBlog,
      { new: true }
    )
    .populate('user', { username: 1, name: 1 })
    .populate('comments', { content: 1 })

  response.status(200).json(updatedBlog)
})

blogRouter.put('/:id/like', async (request, response, next) => {
  const body = request.body

  const updatedBlog = await Blog
    .findByIdAndUpdate(
      request.params.id,
      { likes: body.likes },
      { new: true }
    )

  response.status(200).json({ likes: updatedBlog.likes })
})

blogRouter.post('/:id/comment', async (request, response, next) => {
  const body = request.body

  const e = new Error()

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    e.name = 'DoesNotExistError'
    e.message = 'Blog does not exist.'
    throw e
  }

  const newComment = new Comment({ ...body, blog: blog._id })

  const savedComment = await newComment.save()

  blog.comments = [ savedComment ].concat(blog.comments)
  await blog.save()

  const commentToReturn = await Comment
    .findById(savedComment._id)
    .populate('blog')

  response.status(201).json(commentToReturn)
})

module.exports = blogRouter