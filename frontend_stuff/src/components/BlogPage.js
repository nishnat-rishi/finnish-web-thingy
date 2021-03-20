import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import {
  likeBlog,
  removeBlog,
  selectRawBlogs,
  addComment
} from '../features/blog/blogSlice'
import { selectUser } from '../features/user/userSlice'

import {
  Button,
  Confirm,
  Container,
  Divider,
  Form,
  Header,
  Icon,
  Label,
  List,
  Transition
} from 'semantic-ui-react'

import ContentPlaceholder from './ContentPlaceholder'


const BlogPage = ({ notificationRef }) => {

  const dispatch = useDispatch()
  const history = useHistory()

  const [ comment, setComment ] = useState('')

  const [ openConfirm, setOpenConfirm ] = useState(false)

  const { blogId } = useParams()

  const blog = useSelector(state => selectRawBlogs(state)
    .find(blog => blog.id === blogId)
  )

  const user = useSelector(selectUser)

  const like = (blog) => {
    dispatch(likeBlog(blog))
  }

  const remove = (blog) => {
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

  const addCommentFor = (blog, comment) => {
    dispatch(addComment({ blog, comment })).then(() => {
      setComment('')
    })
  }

  return (
    <Container>
      {blog &&
      (
        <div>
          <Header as='h2' style={{
            textAlign: 'center'
          }}>
            <Header.Content content={blog.title} style={{
              textDecoration: 'double underline',
              padding: 20
            }}/>
            <Header.Subheader>
              <a href={blog.url}>
                <em>{blog.url}</em>
              </a>
            </Header.Subheader>
          </Header>
          <Divider />
          <Container style={{
            color: 'grey',
            marginBottom: 20
          }}>
              Author: <em>{blog.author}</em>
          </Container>
          <ContentPlaceholder />
          <Container style={{
            marginBottom: 20
          }}>
            Added by: <em>{blog.user.name}</em>
          </Container>
          <Button as='div' labelPosition='left' style={{
            marginBottom: 10,
            height: 40
          }}>
            <Label basic pointing='right' style={{
              width: 60
            }}>
              <Transition.Group animation='horizontal flip' duration={200} style={{
                textAlign: 'center',
              }}>
                {blog.likes !== null &&
                      <Container basic>{blog.likes}</Container>
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
          <div style={{
            display: 'inline',
            float: 'right'
          }}>
            {user &&
              user.username === blog.user.username &&
                <Button
                  color='red'
                  inverted
                  content='Remove'
                  onClick={() => setOpenConfirm(true)}
                  style={{
                    height: 40
                  }} />
            }
          </div>

          <Divider />
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

          <Confirm
            open={openConfirm}
            content={`Are you sure you wanna delete '${blog.title}' by '${blog.author}'?`}
            onCancel={() => setOpenConfirm(false)}
            onConfirm={() => remove(blog)}
          />
        </div>
      )
      }
    </Container>
  )
}

export default BlogPage