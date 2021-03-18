import React from 'react'

import Blogs from './Blogs'
import CreationForm from './CreationForm'
import Togglable from './Togglable'

import { selectUser } from '../features/user/userSlice'

import { useSelector } from 'react-redux'

const Home = ({ creationFormRef, notificationRef }) => {

  const user = useSelector(selectUser)

  return (
    <>
      {user &&
      (
        <div>
          <Togglable
            showLabel='Create New Blog'
            hideLabel='Hide'
            ref={creationFormRef}>
            <CreationForm
              notificationRef={notificationRef}
              creationFormRef={creationFormRef}
            />
          </Togglable>
          <Blogs
            notificationRef={notificationRef}
          />
        </div>
      )
      }
    </>
  )
}

export default Home