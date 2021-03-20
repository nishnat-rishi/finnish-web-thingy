import { configureStore } from '@reduxjs/toolkit'

import blogSlice from '../features/blog/blogSlice'
import userSlice from '../features/user/userSlice'

export default configureStore({
  reducer: {
    blogs: blogSlice.reducer,
    user: userSlice.reducer,
  }
})