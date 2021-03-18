import React, { useState } from 'react'

import { loginUser, logoutUser, selectUser } from '../features/user/userSlice'

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

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  if (user) {
    return (
      <div>
        <div>
          <strong>{user.name}</strong>
          <em> logged-in.</em>
        </div>

        <div>
          <button onClick={handleLogout}>
          Logout
          </button>
        </div>
      </div>
    )
  } else {
    return (
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
    )
  }

}

export default LoginForm