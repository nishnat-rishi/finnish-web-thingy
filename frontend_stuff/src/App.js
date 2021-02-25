import React, { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'

import Notification from './components/Notification'
import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import CreationForm from './components/CreationForm'
import Togglable from './components/Togglable'

const App = () => {
  // There HAS to be a way to add a function over this setBlogs!!!
  // Otherwise we have to add a .slice().sort(...) everywhere we use setBlogs
  // instead of it automatically happening!!!

  const [blogs, setBlogsRaw] = useState([])
  const [user, setUser] = useState(null)

  const creationFormRef = useRef()
  const notificationRef = useRef()

  const setBlogs = (newBlogs) => {
    setBlogsRaw(
      newBlogs
        .slice()
        .sort((b1, b2) => b2.likes - b1.likes)
    )
  }

  useEffect(() => (async () => {
    const retrievedBlogs = await blogService.getAll()
    setBlogs(retrievedBlogs)
  })(), [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  return <div>
    <h1>Welcome to Bloglist!</h1>
    <Notification ref={notificationRef}/>
    <LoginForm
      user={user}
      setUser={setUser}
      notificationRef={notificationRef}
    />
    {user &&
    <div>
      <Togglable
        showLabel='Create New Blog'
        hideLabel='Hide'
        ref={creationFormRef}>
        <CreationForm
          blogs={blogs}
          setBlogs={setBlogs}
          notificationRef={notificationRef}
          creationFormRef={creationFormRef}
        />
      </Togglable>
      <Blogs
        user={user}
        blogs={blogs}
        setBlogs={setBlogs}
        notificationRef={notificationRef}
      />
    </div>}
  </div>
}

export default App