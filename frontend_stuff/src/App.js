
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBookForm from './components/NewBookForm'
import YearChangeForm from './components/YearChangeForm'

const App = () => {
  const [ page, setPage ] = useState('authors')

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('edit')}>edit author</button>
      </div>

      <Authors
        show={page === 'authors'}
      />

      <Books
        show={page === 'books'}
      />

      <NewBookForm
        show={page === 'add'}
      />
      <YearChangeForm
        show={page === 'edit'}
      />

    </div>
  )
}

export default App