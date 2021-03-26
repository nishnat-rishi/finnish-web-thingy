import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { ALL_BOOKS } from '../queries_mutations'

const Books = (props) => {

  const result = useQuery(ALL_BOOKS)

  const [ books, setBooks ] = useState([])
  const [ booksToShow, setBooksToShow ] = useState([])

  const [ genres, setGenres ] = useState(new Set())

  const [ filter, setFilter ] = useState(null)

  useEffect(() => {
    if (result.data && result.data.allBooks) {
      setBooks(result.data.allBooks)
    }
  }, [ result ])

  useEffect(() => {
    if (books.length > 0) {
      const gSet = new Set()
      books.map(b => {
        b.genres.map(genre => gSet.add(genre))
      })
      setGenres(gSet)
    }
  }, [ books ])

  useEffect(() => {
    if (!filter) {
      setBooksToShow(books)
    } else {
      setBooksToShow(books.filter(b => b.genres.includes(filter)))
    }
  }, [ filter, books ])

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      {filter && <h3>genre: {filter}</h3>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {booksToShow
            .map(a =>
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            )}
        </tbody>
      </table>
      {Array.from(genres).map(g =>
        <button
          key={g}
          onClick={() => setFilter(g)}
        >
          {g}
        </button>
      )}
      {filter &&
        <div>
          <button onClick={() => setFilter(null)}>
            clear filter
          </button>
        </div>}
    </div>
  )
}

export default Books