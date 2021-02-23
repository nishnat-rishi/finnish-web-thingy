import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Blog from './Blog'

describe('<Blog /> tests', () => {
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


  test('title, author shown by default', () => {

    const likeHandler = jest.fn()
    const removeHandler = jest.fn()

    const component = render(
      <Blog
        blog={blog}
        removable={true}
        likeHandler={likeHandler}
        removeHandler={removeHandler}
      />
    )

    expect(component.baseElement).toHaveTextContent(blog.title)
    expect(component.baseElement).toHaveTextContent(blog.author)
  })

  test('url, likes not shown by default', () => {

    const likeHandler = jest.fn()
    const removeHandler = jest.fn()

    const component = render(
      <Blog
        blog={blog}
        removable={true}
        likeHandler={likeHandler}
        removeHandler={removeHandler}
      />
    )

    expect(component.baseElement).not.toHaveTextContent(blog.url)
    expect(component.baseElement).not.toHaveTextContent(blog.likes)
  })

  test('url, likes shown when `View` button pressed', () => {

    const likeHandler = jest.fn()
    const removeHandler = jest.fn()

    const component = render(
      <Blog
        blog={blog}
        removable={true}
        likeHandler={likeHandler}
        removeHandler={removeHandler}
      />
    )

    fireEvent.click(component.getByText('View'))

    expect(component.baseElement).toHaveTextContent(blog.url)
    expect(component.baseElement).toHaveTextContent(blog.likes)
  })

  test('`Like` button calls likeHandler', () => {

    const likeHandler = jest.fn()
    const removeHandler = jest.fn()

    const component = render(
      <Blog
        blog={blog}
        removable={true}
        likeHandler={likeHandler}
        removeHandler={removeHandler}
      />
    )

    fireEvent.click(component.getByText('View'))

    const likeButton = component.getByText('Like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(likeHandler.mock.calls).toHaveLength(2)
  })

})