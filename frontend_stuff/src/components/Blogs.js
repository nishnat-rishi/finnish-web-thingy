import React from 'react'

import Blog from './Blog'

import blogService from '../services/blogs'

const Blogs = ({ blogs, setBlogs, user, notificationRef }) => {
  const like = async (blog) => {
    const newBlog = await blogService
      .update(blog.id,
        { ...blog, likes: blog.likes + 1 }
      )

    setBlogs(
      blogs
        .map(blog => blog.id !== newBlog.id ? blog : newBlog)
    )
  }

  const remove = async (blog) => {
    if (window.confirm(`Are you sure you wanna delete ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } catch (exception) {
        notificationRef.current.show(`${exception.response.data.error}`, 'failure')
      }
    }
  }

  return (
    <div>
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