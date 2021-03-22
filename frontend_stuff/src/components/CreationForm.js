import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useDispatch } from 'react-redux'

import { addBlog } from '../features/blog/blogSlice'

const CreationForm = ({ notificationRef }) => {

  const dispatch = useDispatch()

  const [ title, setTitle ] = useState('')
  const [ author, setAuthor ] = useState('')
  const [ url, setUrl ] = useState('')

  const handleCreation = (event) => {
    event.preventDefault()
    dispatch(addBlog({ title, author, url }))
      .then(action => {
        notificationRef.current.show(
          `Blog '${action.payload.title}' created successfully!`,
          'success'
        )
      })
      .catch(exception => {
        notificationRef.current.show(
          `Something went wrong: ${exception}`,
          'failure'
        )
      })
  }

  return (
    <div>
      <h2>Create New Blog</h2>
      <form id='creationForm' onSubmit={handleCreation}>
        <table>
          <tbody>
            <tr>
              <td>
              Title:
              </td>
              <td>
                <input
                  id='title'
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
                  id='author'
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
                  id='url'
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
  notificationRef: PropTypes.object.isRequired
}

export default CreationForm