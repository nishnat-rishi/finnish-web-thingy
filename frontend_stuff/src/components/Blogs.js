import React from 'react'

import Blog from './Blog'

import { useDispatch, useSelector } from 'react-redux'

import {
  likeBlog,
  removeBlog,
  selectArrangedBlogs
} from '../features/blog/blogSlice'
import { selectUser } from '../features/user/userSlice'

const Blogs = ({ notificationRef }) => {

  const dispatch = useDispatch()

  const blogs = useSelector(selectArrangedBlogs)
  const user = useSelector(selectUser)

  const like = (blog) => {
    dispatch(likeBlog(blog))
  }

  const remove = (blog) => {
    if (window.confirm(
      `Are you sure you wanna delete ${blog.title} by ${blog.author}?`
    )) {
      dispatch(removeBlog(blog))
        .catch(exception =>
          notificationRef.current.show(
            `${exception.response.data.error}`, 'failure'
          )
        )
    }
  }

  return (
    <div id='blog-list'>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          likeHandler={() => like(blog)}
          removable={user.username === blog.user.username}
          removeHandler={() => remove(blog)}
        />
      )}
    </div>
  )
}



export default Blogs