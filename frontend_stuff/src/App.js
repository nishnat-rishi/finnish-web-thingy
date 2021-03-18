import React, { useEffect, useRef } from 'react'

import Notification from './components/Notification'
import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import CreationForm from './components/CreationForm'
import Togglable from './components/Togglable'

import { useDispatch, useSelector } from 'react-redux'

import {
  fetchInitialBlogs
} from './features/blog/blogSlice'
import { retrieveExistingUser } from './features/user/userSlice'

const App = () => {
  const dispatch = useDispatch()

  const user = useSelector(state => state.user)

  const creationFormRef = useRef()
  const notificationRef = useRef()

  useEffect(() => {
    dispatch(fetchInitialBlogs())
  }, [ dispatch ])

  useEffect(() => {
    dispatch(retrieveExistingUser())
  }, [ dispatch ])

  return <div>
    <h1>Welcome to Bloglist!</h1>
    <Notification ref={notificationRef}/>
    <LoginForm
      notificationRef={notificationRef}
    />
    {user &&
      (
        <div>
          <Togglable
            showLabel='Create New Blog'
            hideLabel='Hide'
            ref={creationFormRef}>
            <CreationForm
              notificationRef={notificationRef}
              creationFormRef={creationFormRef}
            />
          </Togglable>
          <Blogs
            notificationRef={notificationRef}
          />
        </div>
      )
    }
  </div>
}

export default App