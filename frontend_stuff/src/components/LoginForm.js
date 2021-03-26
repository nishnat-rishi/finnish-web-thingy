import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { LOGIN } from '../queries_mutations'

const LoginForm = (props) => {

  const [ login, result ] = useMutation(LOGIN, {
    onError: error => {
      if (error.graphQLErrors.length > 0) {
        props.notify(error.graphQLErrors[0].message)
      }
    }
  })

  useEffect(() => {
    if (result.data && result.data.login) {
      const token = result.data.login.value
      props.setToken(token)
      localStorage.setItem('gql-authors-user', token)
    }
  }, [ result.data ]) //eslint-disable-line

  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')

  if (!props.show) {
    return null
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    login({ variables: {
      username,
      password
    } })

    setUsername('')
    setPassword('')
  }

  return <div>
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
      <div>
      username:
        <input
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
      password:
        <input
          value={password}
          type='password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  </div>
}

export default LoginForm
