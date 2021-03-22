import React, { useEffect, useRef } from 'react'

import Notification from './components/Notification'
import HomePage from './components/HomePage'
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
import { Container, Header } from 'semantic-ui-react'

const App = () => {
  const dispatch = useDispatch()

  const notificationRef = useRef()
  const fullPageRef = useRef()

  useEffect(() => {
    dispatch(fetchInitialBlogs())
  }, [ dispatch ])

  useEffect(() => {
    dispatch(retrieveExistingUser())
  }, [ dispatch ])

  return <div ref={fullPageRef}>
    <Router>
      <Container>
        <NavigationBar />
        <Notification
          ref={notificationRef}
          {...{ fullPageRef }}
        />
        <Header as='h1' dividing>Welcome to Bloglist!</Header>
        <LoginForm {...{ notificationRef }}/>

        <Switch>
          <Route path='/users' component={Users} />
          <Route path='/blogs/:blogId'>
            <BlogPage {...{ notificationRef }} />
          </Route>
          <Route path='/'>
            <HomePage {...{ notificationRef }} />
          </Route>
        </Switch>
      </Container>
    </Router>
  </div>
}

export default App