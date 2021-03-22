import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Divider, Form, Header, List, Transition } from 'semantic-ui-react'
import { addComment } from '../features/blog/blogSlice'

const CommentSection = ({ blog }) => {

  const [ comment, setComment ] = useState('')

  const dispatch = useDispatch()

  const addCommentFor = (blog, comment) => {
    dispatch(addComment({ blog, comment }))

    setComment('') // Immediately removes comment from TextArea
  }

  return (
    <>
      <Header as='h3' >Comments</Header>
      <Form onSubmit={() => addCommentFor(blog, comment)}>
        <Form.TextArea
          name='comment'
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          placeholder='Say something...' />
        <Form.Button
          content='Add Comment'
          basic
          style={{
            marginBottom: 20
          }}/>
      </Form>
      <List as='ol' style={{
        paddingBottom: 20
      }}>
        <Transition.Group
          animation='slide down'
          duration={200}
        >
          {blog.comments.map(comment =>
            <List.Item
              as='li'
              value='>'
              key={comment.id}
            >
              {comment.content}
            </List.Item>)}
        </Transition.Group>
      </List>
    </>
  )
}

export default CommentSection