import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS, BOOKS_BY_GENRE } from '../queries_mutations'

const NewBookForm = (props) => {

  const [ addBook ] = useMutation(ADD_BOOK, {
    onError: error => {
      if (error.graphQLErrors.length > 0) {
        props.notify(error.graphQLErrors[0].message)
      } else {
        console.log(JSON.stringify(error))
      }
    },
    update: (cache, mutationResult) => {
      const booksData = cache.readQuery({ query: ALL_BOOKS })
      const authorsData = cache.readQuery({ query: ALL_AUTHORS })

      cache.writeQuery({
        query: ALL_BOOKS,
        data: {
          ...booksData,
          allBooks: [ ...booksData.allBooks, mutationResult.data.addBook ]
        }
      })

      const authorExists = authorsData.allAuthors.map(a => a.name)
        .includes(mutationResult.data.addBook.author.name)

      if (!authorExists) {
        cache.writeQuery({
          query: ALL_AUTHORS,
          data: {
            ...authorsData,
            allAuthors: [ ...authorsData.allAuthors, mutationResult.data.addBook.author ]
          }
        })
      }

      const genres = mutationResult.data.addBook.genres
      let booksByGenreData
      for (let genre of genres) {
        booksByGenreData = cache.readQuery({
          query: BOOKS_BY_GENRE,
          variables: {
            genre
          }
        })

        cache.writeQuery({
          query: BOOKS_BY_GENRE,
          variables: {
            genre
          },
          data: {
            ...booksByGenreData,
            allBooks: [
              ...booksByGenreData.allBooks,
              mutationResult.data.addBook
            ]
          }
        })
      }
    }
  })

  const [ title, setTitle ] = useState('')
  const [ authorName, setAuthorName ] = useState('')
  const [ published, setPublished ] = useState('')
  const [ genre, setGenre ] = useState('')
  const [ genres, setGenres ] = useState([])

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    addBook({ variables: {
      title,
      published: Number(published),
      author: { name: authorName },
      genres
    } })

    setTitle('')
    setPublished('')
    setAuthorName('')
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
          author name
          <input
            value={authorName}
            onChange={({ target }) => setAuthorName(target.value)}
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

export default NewBookForm