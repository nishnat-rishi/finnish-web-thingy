import React from 'react'
import {  useSelector } from 'react-redux'
import {  useParams } from 'react-router'
import { selectUsers } from '../features/blog/blogSlice'

const User = () => {

  const { userId } = useParams()

  const user = useSelector(state => selectUsers(state)[userId])

  const userBlogs = useSelector(state => state.blogs.filter(blog =>
    blog.user.id === userId
  ))

  return (
    <div>
      {user &&
        (<h2>{user.name}</h2>)
      }
      <h3>Added blogs:</h3>
      <ul>
        {userBlogs.map(blog =>
          <li key={blog.id}>{blog.title}</li>
        )}
      </ul>
    </div>
  )
}

export default User