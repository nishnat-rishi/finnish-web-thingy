import React, { useState } from 'react'

import { loginUser, selectUser } from '../features/user/userSlice'

import { useDispatch, useSelector } from 'react-redux'

const LoginForm = ({ notificationRef }) => {

  const dispatch = useDispatch()

  const user = useSelector(selectUser)

  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    dispatch(loginUser({
      username,
      password
    })).then(() => {
      setUsername('')
      setPassword('')
    }).catch(() => {
      notificationRef.current.show(
        'Wrong credentials.',
        'failure'
      )
    })
  }

  return (
    <>
      {!user &&
        <form onSubmit={handleLogin}>
          <div>
            Username:
            <input
              id='username-input'
              type='text'
              value={username}
              name='Username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>Password:
            <input
              id='password-input'
              type='password'
              value={password}
              name='Password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id='login-submit' type='submit'>Login</button>
        </form>
      }
    </>
  )

}

export default LoginForm