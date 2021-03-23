import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useAuthors } from '../hooks'
import { ALL_AUTHORS, EDIT_BIRTH_YEAR } from '../queries_mutations'

const YearChangeForm = ({ show }) => {

  const authors = useAuthors()

  const [ editAuthor ] = useMutation(EDIT_BIRTH_YEAR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  const [ name, setName ] = useState('')
  const [ born, setBorn ] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    editAuthor({ variables: {
      name,
      born: Number(born)
    } })

    setBorn('')
  }

  if (!show) {
    return null
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit author</h2>
      <div>
        <select
          value={name}
          onChange={({ target }) => setName(target.value)}>
          {
            authors.map(author =>
              <option
                key={author.name}
                value={author.name}>
                {author.name}
              </option>
            )
          }
        </select>
      </div>
      <div>
        birth year:
        <input
          type='number'
          value={born}
          onChange={({ target }) =>
            setBorn(target.value)} />
      </div>
      <button type='submit'>
        change
      </button>
    </form>
  )
}

export default YearChangeForm