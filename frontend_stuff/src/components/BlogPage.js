import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { likeBlog, removeBlog, selectRawBlogs } from '../features/blog/blogSlice'
import { selectUser } from '../features/user/userSlice'

const BlogPage = ({ notificationRef }) => {

  const dispatch = useDispatch()
  const history = useHistory()

  const { blogId } = useParams()

  const blog = useSelector(state => selectRawBlogs(state)
    .find(blog => blog.id === blogId)
  )

  const user = useSelector(selectUser)

  const like = (blog) => {
    dispatch(likeBlog(blog))
  }

  const remove = (blog) => {
    if (window.confirm(
      `Are you sure you wanna delete ${blog.title} by ${blog.author}?`
    )) {
      dispatch(removeBlog(blog))
        .then(() => {
          history.push('/')
          notificationRef.current.show('Blog removed successfully!')
        })
        .catch(exception =>
          notificationRef.current.show(
            `${exception.response.data.error}`, 'failure'
          )
        )
    }
  }

  return (
    <div>
      {blog &&
      (
        <div>
          <h3>{blog.title}</h3>
          <p>{blog.url}</p>
          <p>
            {blog.likes} likes!
            <button onClick={() => like(blog)}>Like</button>
          </p>
          <p>{blog.author}</p>
          <p>Added by: <em>{blog.user.name}</em></p>
          {user && (
            user.username === blog.user.username &&
            (
              <button onClick={() => remove(blog)}>
                Remove
              </button>
            )
          )
          }
        </div>
      )
      }
    </div>
  )
}

export default BlogPage