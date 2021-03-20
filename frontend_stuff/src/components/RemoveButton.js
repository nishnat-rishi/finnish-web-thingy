import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { Button, Confirm } from 'semantic-ui-react'
import { removeBlog } from '../features/blog/blogSlice'

const RemoveButton = ({
  blog,
  user,
  notificationRef
}) => {

  const dispatch = useDispatch()
  const history = useHistory()

  const [ openConfirm, setOpenConfirm ] = useState(false)

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

  return (
    <>
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
      <Confirm
        open={openConfirm}
        content={
          `Are you sure you wanna delete '${blog.title}' 
          by '${blog.author}'?`
        }
        onCancel={() => setOpenConfirm(false)}
        onConfirm={() => remove(blog)}
      />
    </>
  )
}

export default RemoveButton