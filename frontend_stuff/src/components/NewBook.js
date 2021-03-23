import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { ADD_BOOK } from '../queries_mutations'

const NewBook = (props) => {

  const [ addBook, result ] = useMutation(ADD_BOOK)

  const [ title, setTitle ] = useState('')
  const [ author, setAuthor ] = useState('')
  const [ published, setPublished ] = useState('')
  const [ genre, setGenre ] = useState('')
  const [ genres, setGenres ] = useState([])

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  const clearGenres = () => {
    setGenres([])
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type='button'>add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
          <button onClick={clearGenres}>
            clear genres
          </button>
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook