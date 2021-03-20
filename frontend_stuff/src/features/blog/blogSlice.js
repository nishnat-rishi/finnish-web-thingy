import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { chain } from 'lodash'

import blogService from '../../services/blogs'

export const fetchInitialBlogs = createAsyncThunk(
  'blogs/init',
  async () => await blogService.getAll()
)

export const addBlog = createAsyncThunk(
  'blogs/create',
  async newBlog => await blogService.create(newBlog)
)

export const likeBlog = createAsyncThunk(
  'blogs/like',
  async blog => {
    const { likes } = await blogService.like(blog)
    console.log()
    return { id: blog.id, likes }
  }
)

export const removeBlog = createAsyncThunk(
  'blogs/remove',
  async blog => {
    await blogService.remove(blog.id)
    return blog
  }
)

export const addComment = createAsyncThunk(
  'blogs/comment',
  async (details) => await blogService
    .comment(details.blog.id, details.comment)
)

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
  },
  extraReducers: {
    [fetchInitialBlogs.fulfilled]: (state, action) => {
      return action.payload
    },
    [addBlog.fulfilled]: (state, action) => {
      state.push(action.payload)
    },
    [likeBlog.pending]: (state, action) => {
      const likedBlogId = action.meta.arg.id
      const indexToChange = state.findIndex(blog =>
        blog.id === likedBlogId
      )
      state[indexToChange].likes = null
    },
    [likeBlog.fulfilled]: (state, action) => {
      const likedBlogDetails = action.payload
      const indexToChange = state.findIndex(blog =>
        blog.id === likedBlogDetails.id
      )
      state[indexToChange].likes = likedBlogDetails.likes
    },
    [removeBlog.fulfilled]: (state, action) => {
      const removedBlog = action.payload
      const indexToRemove = state.findIndex(blog =>
        blog.id === removedBlog.id
      )
      state.splice(indexToRemove, 1)
    },
    [addComment.fulfilled]: (state, action) => {
      const comment = action.payload
      const changedBlogIndex = state.findIndex(blog =>
        blog.id === comment.blog.id
      )
      state[changedBlogIndex]
        .comments
        .unshift({ content: comment.content, id: comment.id })
    }
  }
})

export const selectRawBlogs = state =>
  state.blogs

export const selectBlogWithId = id => state =>
  selectRawBlogs(state)
    .find(blog => blog.id === id)

export const selectArrangedBlogs = state =>
  selectRawBlogs(state)
    .slice()
    .sort((b1, b2) => b2.likes - b1.likes)

export const selectUsers = state =>
  chain(
    state.blogs.map(blog => [ blog.user.id, blog.user ])
  )
    .fromPairs()
    .value()

export default blogSlice