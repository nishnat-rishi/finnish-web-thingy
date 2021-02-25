import React, { useState } from 'react'

const Blog = ({ blog, removable, likeHandler, removeHandler }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const toggleDetails = () => setDetailsVisible(!detailsVisible)

  return (
    detailsVisible
      ?
      <div className='blog'>
        <p>{blog.title} - <em>{blog.author}</em></p>
        <p>{blog.url}</p>
        <p className='likes'>
          {blog.likes}
          {' '}
          <button onClick={likeHandler}>Like</button>
        </p>
        <p>{blog.user.name}</p>
        <p>
          <button onClick={toggleDetails}>Hide</button>
        </p>
        <p>
          {
            removable
            &&
           <button onClick={removeHandler}>Remove</button>
          }
        </p>
      </div>
      :
      <div className='blog'>
        {blog.title} - <em>{blog.author}</em>
        {' '}
        <button onClick={toggleDetails}>View</button>
      </div>
  )
}

export default Blog