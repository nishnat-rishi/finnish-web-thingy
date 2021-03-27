
import { useApolloClient, useSubscription } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBookForm from './components/NewBookForm'
import Recommendations from './components/Recommendations'
import YearChangeForm from './components/YearChangeForm'
import { ALL_AUTHORS, ALL_BOOKS, BOOKS_BY_GENRE, BOOK_ADDED } from './queries_mutations'

const App = () => {
  const [ page, setPage ] = useState('authors')
  const [ token, setToken ] = useState(null)
  const [ error, setError ] = useState(null)
  const [ errorTimeout, setErrorTimeout ] = useState(null)

  const client = useApolloClient()

  useEffect(() => {
    const prevToken = localStorage.getItem('gql-authors-user')
    if (prevToken) {
      setToken(prevToken)
    }
  }, [])

  const updateCacheWith = (cache, addedBook) => {
    const booksData = cache.readQuery({ query: ALL_BOOKS })
    const authorsData = cache.readQuery({ query: ALL_AUTHORS })

    if (!booksData.allBooks.map(b => b.id).includes(addedBook.id)) {
      cache.writeQuery({
        query: ALL_BOOKS,
        data: {
          ...booksData,
          allBooks: [ ...booksData.allBooks, addedBook ]
        }
      })

      const authorExists = authorsData.allAuthors.map(a => a.name)
        .includes(addedBook.author.name)

      if (!authorExists) {
        cache.writeQuery({
          query: ALL_AUTHORS,
          data: {
            ...authorsData,
            allAuthors: [ ...authorsData.allAuthors, addedBook.author ]
          }
        })
      }

      const genres = addedBook.genres
      let booksByGenreData
      for (let genre of genres) {
        booksByGenreData = cache.readQuery({
          query: BOOKS_BY_GENRE,
          variables: {
            genre
          }
        })

        if (booksByGenreData) {  // if this query has been made
          cache.writeQuery({
            query: BOOKS_BY_GENRE,
            variables: {
              genre
            },
            data: {
              ...booksByGenreData,
              allBooks: [
                ...booksByGenreData.allBooks,
                addedBook
              ]
            }
          })
        }
      }
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(`${addedBook.title} added!`)
      updateCacheWith(client, addedBook)
    }
  })

  const notify = (message) => {
    window.clearTimeout(errorTimeout)
    setError(message)
    setErrorTimeout(
      window.setTimeout(() => {
        setError(null)
      }, 5000)
    )
  }

  const logout = () => {
    localStorage.clear()
    setToken(null)
    if ([ 'add', 'edit', 'recommend' ].includes(page))
      setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token &&
          <>
            <button onClick={() => setPage('recommend')}>
              recommend
            </button>
            <button onClick={() => setPage('add')}>
              add book
            </button>
            <button onClick={() => setPage('edit')}>
              edit author
            </button>
            <button onClick={logout}>
            logout
            </button>
          </>
        }
        {!token &&
          <button onClick={() => setPage('login')}>
            login
          </button>
        }
      </div>

      <Notification error={error} />

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <Recommendations
        show={page === 'recommend'}
        token={token}
      />

      <NewBookForm
        show={page === 'add'}
        token={token}
        notify={notify}
        updateCacheWith={updateCacheWith}
      />

      <YearChangeForm
        show={page === 'edit'}
        token={token}
      />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        notify={notify}
      />

    </div>
  )
}

const Notification = ({ error }) => {

  if (!error) {
    return <div></div>
  }

  return (
    <div style={{ color: 'red' }}>
      {error}
    </div>
  )
}

export default App