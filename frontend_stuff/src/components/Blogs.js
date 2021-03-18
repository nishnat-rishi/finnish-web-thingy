import React from 'react'

import { useSelector } from 'react-redux'

import {
  selectArrangedBlogs
} from '../features/blog/blogSlice'
import { Link } from 'react-router-dom'

const Blogs = () => {

  const blogs = useSelector(selectArrangedBlogs)

  return (
    <div id='blog-list'>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <div className='blog' key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>
            {blog.title} - <em>{blog.author}</em>
          </Link>
        </div>
      )}
    </div>
  )
}



export default Blogs