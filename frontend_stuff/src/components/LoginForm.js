import React, { useState } from 'react'
import PropTypes from 'prop-types'

import loginService from '../services/login'
import noteService from '../services/notes'

const LoginForm = ({ user, setUser, notificationRef }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notificationRef.current.show('Wrong credentials.', 'failure')
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
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
            type='text'
            value={username}
            name='Username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>Password:
          <input
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>Login</button>
      </form>
    )
  }
}

LoginForm.propTypes = {
  setUser: PropTypes.func.isRequired,
  notificationRef: PropTypes.object.isRequired
}

export default LoginForm