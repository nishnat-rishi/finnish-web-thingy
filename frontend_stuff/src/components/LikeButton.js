import React from 'react'
import { useDispatch } from 'react-redux'
import { Button, Icon, Label, Transition } from 'semantic-ui-react'
import { likeBlog } from '../features/blog/blogSlice'

const LikeButton = ({ blog, notificationRef }) => {

  const dispatch = useDispatch()

  const like = (blog) => {
    dispatch(likeBlog(blog))
    notificationRef.current.show('You liked the blog!')
  }

  return (
    <Button as='div' labelPosition='left' style={{
      marginBottom: 10,
      height: 40
    }}>
      <Label basic pointing='right'>
        <Transition.Group as='div' animation='horizontal flip' duration={200} style={{
          width: 40,
        }}>
          {blog.likes !== null &&
                  <span>{blog.likes}</span>
          }
        </Transition.Group>
      </Label>
      <Button
        primary
        icon
        onClick={() => like(blog)}
        style={{
          width: 80
        }} >
        <Icon name='thumbs up outline' />
        {' '}
                Like
      </Button>
    </Button>
  )
}

export default LikeButton