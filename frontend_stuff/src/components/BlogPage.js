import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import {
  selectRawBlogs,
} from '../features/blog/blogSlice'
import { selectUser } from '../features/user/userSlice'

import {
  Container,
  Divider,
  Header,
} from 'semantic-ui-react'

import ContentPlaceholder from './ContentPlaceholder'
import LikeButton from './LikeButton'
import RemoveButton from './RemoveButton'
import CommentSection from './CommentSection'


const BlogPage = ({ notificationRef }) => {

  const { blogId } = useParams()

  const blog = useSelector(state => selectRawBlogs(state)
    .find(blog => blog.id === blogId)
  )

  const user = useSelector(selectUser)

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
          <LikeButton blog={blog} />
          <RemoveButton {...{ user, blog, notificationRef }}/>

          <Divider />
          <CommentSection blog={blog} />
        </div>
      )
      }
    </Container>
  )
}

export default BlogPage