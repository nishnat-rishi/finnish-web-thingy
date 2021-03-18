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
  async blog => await blogService
    .update(blog.id,
      { ...blog, likes: blog.likes + 1 }
    )
)

export const removeBlog = createAsyncThunk(
  'blogs/remove',
  async blog => {
    await blogService.remove(blog.id)
    return blog
  }
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
    [likeBlog.fulfilled]: (state, action) => {
      const updatedBlog = action.payload
      const indexToChange = state.findIndex(blog =>
        blog.id === updatedBlog.id
      )
      state[indexToChange] = updatedBlog
    },
    [removeBlog.fulfilled]: (state, action) => {
      const removedBlog = action.payload
      const indexToRemove = state.findIndex(blog =>
        blog.id === removedBlog.id
      )
      state.splice(indexToRemove, 1)
    }
  }
})

export const selectRawBlogs = state => state
  .blogs

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