import React, { useState } from 'react'
import PropTypes from 'prop-types'

import blogService from '../services/blogs'

const CreationForm = ({ blogs, setBlogs, notificationRef, creationFormRef }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreation = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({
        title, author, url
      })
      setBlogs(
        blogs
          .concat(newBlog)
          // .slice()
          // .sort((b1, b2) => b1.likes - b2.likes)
      )
      notificationRef.current.show(
        `Blog '${newBlog.title}' created successfully!`,
        'success'
      )
      creationFormRef.current.toggleVisibility()
    } catch (exception) {
      notificationRef.current.show(
        `Something went wrong: ${exception}`,
        'failure'
      )
    }
  }

  return (
    <div>
      <h2>Create New Blog</h2>
      <form onSubmit={handleCreation}>
        <table>
          <tbody>
            <tr>
              <td>
              Title:
              </td>
              <td>
                <input
                  type='text'
                  value={title}
                  name='Title'
                  onChange={({ target }) => setTitle(target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>
            Author:
              </td>
              <td>
                <input
                  type='text'
                  value={author}
                  name='Author'
                  onChange={({ target }) => setAuthor(target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>
            Url:
              </td>
              <td>
                <input
                  type='text'
                  value={url}
                  name='Url'
                  onChange={({ target }) => setUrl(target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <button type='submit'>
            Submit
          </button>
        </div>
      </form>
    </div>

  )
}

CreationForm.propTypes = {
  setBlogs: PropTypes.func.isRequired,
  notificationRef: PropTypes.object.isRequired,
  creationFormRef: PropTypes.object.isRequired
}

export default CreationForm