import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import PhoneForm from './components/PhoneForm'

import { ALL_PERSONS } from './queries-mutations'

const App = () => {
  const [ errorMessage, setErrorMessage ] = useState(null)

  const result = useQuery(ALL_PERSONS)

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <>
      {result.loading ? (
        <div>loading...</div>
      ) : (
        <>
          <Notify errorMessage={errorMessage} />
          <Persons persons = {result.data.allPersons} />
          <PersonForm setError={notify} />
          <PhoneForm setError={notify} />
        </>
      )
      }
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