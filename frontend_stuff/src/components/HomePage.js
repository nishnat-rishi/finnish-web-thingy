import React, { useState } from 'react'

import Blogs from './Blogs'
import CreationForm from './CreationForm'

import { selectUser } from '../features/user/userSlice'

import { useSelector } from 'react-redux'
import { Container } from 'semantic-ui-react'

const HomePage = ({ notificationRef }) => {

  const user = useSelector(selectUser)

  return (
    <>
      {user &&
      (
        <Container>
          <CreationForm
            notificationRef={notificationRef}
          />
          <Blogs
            notificationRef={notificationRef}
          />
        </Container>
      )
      }
    </>
  )
}

export default HomePage