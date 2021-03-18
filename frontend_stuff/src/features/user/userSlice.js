import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import blogService from '../../services/blogs'
import loginService from '../../services/login'

export const loginUser = createAsyncThunk(
  'user/login',
  async user => await loginService.login(user)
)

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    retrieveExistingUser: () => {
      const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        blogService.setToken(user.token)
        return user
      }
    },
    logoutUser: () => {
      window.localStorage.removeItem('loggedBloglistUser')
      blogService.setToken(null) // is this necessary?
      return null
    }
  },
  extraReducers: {
    [loginUser.fulfilled]: (state, action) => {
      const user = action.payload
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      return user
    }
  }
})

export const {
  retrieveExistingUser,
  logoutUser
} = userSlice.actions

export const selectUser = state => state.user

export default userSlice