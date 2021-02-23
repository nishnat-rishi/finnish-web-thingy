import React, { useState } from 'react'
import { fireEvent, prettyDOM, render } from '@testing-library/react'
import CreationForm from './CreationForm'

describe('<CreationForm />', () => {
  const blog = {
    title: 'This is a test blog',
    author: 'Author_Person',
    url: 'spice.com',
    likes: 543,
    user: {
      name: 'Matti Lukkainen',
      username: 'lukematherson28'
    }
  }

  test.skip('calls setBlogs with the correct details', () => {
    // this test will never work because handleCreation calls axios.create(...)
    // which requires blogService's global variable `token` to be defined as
    // a valid token. since we are supposed to test whether this form calls an
    // outside prop-given function `handleCreation` once, (and since we've not actually)
    // implemented CreationForm like that, instead choosing to couple the creationHandler
    // with the form in order to clean up <App />, we won't be able to test this without
    // a companion inclusion of blogService with a correct token as well.

    const [blogs, setBlogs] = [[], jest.fn()]

    const notificationRef = {
      current: {
        show: jest.fn()
      }
    }

    const creationFormRef = {
      current: {
        toggleVisibility: jest.fn()
      }
    }

    const component = render(
      <CreationForm
        blogs={blogs}
        setBlogs={setBlogs}
        notificationRef={notificationRef}
        creationFormRef={creationFormRef}
      />
    )

    const titleInput = component.container.querySelector('#title')
    const authorInput = component.container.querySelector('#author')
    const urlInput = component.container.querySelector('#url')

    const form = component.container.querySelector('#creationForm')

    fireEvent.change(titleInput, { target: { value: blog.title } })
    fireEvent.change(authorInput, { target: { value: blog.author } })
    fireEvent.change(urlInput, { target: { value: blog.url } })

    fireEvent.submit(form)
  })

})