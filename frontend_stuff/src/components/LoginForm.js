import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { LOGIN } from '../queries_mutations'

const LoginForm = ({
  setToken, setError
}) => {
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      if (error.graphQLErrors.length > 0) {
        setError(error.graphQLErrors[0].message)
      } else {
        console.log(JSON.stringify(error))
      }
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('gql-main-user', JSON.stringify({
        username, token
      }))
      setUsername('')
      setPassword('')
    }
  }, [result.data]) // eslint-disable-line

  const submit = async (event) => {
    event.preventDefault()

    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm