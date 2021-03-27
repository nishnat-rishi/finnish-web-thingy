import {
  useApolloClient,
  useQuery,
  useSubscription
} from '@apollo/client'
import React, { useEffect, useState } from 'react'
import LoginForm from './components/LoginForm'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import PhoneForm from './components/PhoneForm'

import { ALL_PERSONS, PERSON_ADDED } from './queries_mutations'

const App = () => {

  const [ token, setToken ] = useState(null)
  const [ username, setUsername ] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)

  const result = useQuery(ALL_PERSONS)

  const client = useApolloClient()

  useEffect(() => {
    const storedInfo = localStorage.getItem('gql-main-user')
    if (storedInfo) {
      setToken(JSON.parse(storedInfo).token)
    }
  }, [])

  useEffect(() => {
    if (token) {
      const storedInfo = localStorage.getItem('gql-main-user')
      setUsername(JSON.parse(storedInfo).username)
    } else {
      setUsername(null)
    }
  }, [ token ])

  const updateCacheWith = (addedPerson) => {
    const personsData = client.readQuery({ query: ALL_PERSONS })
    if (!personsData.allPersons
      .map(p => p.id)
      .includes(addedPerson.id)) {
      client.writeQuery({
        query: ALL_PERSONS,
        data: { allPersons: personsData.allPersons.concat(addedPerson) }
      })
    }
  }

  useSubscription(PERSON_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedPerson = subscriptionData.data.personAdded
      notify(`${addedPerson.name} added`)
      updateCacheWith(addedPerson)
    }
  })

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  if (result.error) {
    return <div>error!!!</div>
  }

  return (
    <>
      <div>
        <strong>{username}</strong> <em>logged in.</em>
        {' '}
        <button onClick={logout}>Logout</button>
      </div>
      <Notify errorMessage={errorMessage} />
      <Persons persons={result.data.allPersons} />
      <PersonForm
        setError={notify}
        updateCacheWith={updateCacheWith}
      />
      <PhoneForm setError={notify} />
    </>
  )
}

const Notify = ({ errorMessage }) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>
  )
}

export default App