
import React, { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBookForm from './components/NewBookForm'
import Recommendations from './components/Recommendations'
import YearChangeForm from './components/YearChangeForm'

const App = () => {
  const [ page, setPage ] = useState('authors')

  const [ token, setToken ] = useState(null)

  useEffect(() => {
    const prevToken = localStorage.getItem('gql-authors-user')
    if (prevToken) {
      setToken(prevToken)
    }
  }, [])

  const [ error, setError ] = useState(null)
  const [ errorTimeout, setErrorTimeout ] = useState(null)

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