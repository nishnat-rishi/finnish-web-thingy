import React, { useEffect, useRef } from 'react'

import Notification from './components/Notification'
import Home from './components/Home'
import Users from './components/Users'
import LoginForm from './components/LoginForm'

import { useDispatch } from 'react-redux'

import {
  fetchInitialBlogs
} from './features/blog/blogSlice'
import { retrieveExistingUser } from './features/user/userSlice'

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import BlogPage from './components/BlogPage'
import NavigationBar from './components/NavigationBar'

const App = () => {
  const dispatch = useDispatch()

  const creationFormRef = useRef()
  const notificationRef = useRef()

  useEffect(() => {
    dispatch(fetchInitialBlogs())
  }, [ dispatch ])

  useEffect(() => {
    dispatch(retrieveExistingUser())
  }, [ dispatch ])

  return <div>
    <Router>
      <NavigationBar />
      <h1>Welcome to Bloglist!</h1>
      <Notification ref={notificationRef}/>
      <LoginForm
        notificationRef={notificationRef}
      />

      <Switch>
        <Route path='/users' component={Users} />
        <Route path='/blogs/:blogId'>
          <BlogPage notificationRef={notificationRef} />
        </Route>
        <Route path='/'>
          <Home
            {...{
              creationFormRef,
              notificationRef
            }}
          />
        </Route>
      </Switch>
    </Router>
  </div>
}

export default App