import { useLazyQuery, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { BOOKS_BY_GENRE, ME } from '../queries_mutations'

const Recommendations = (props) => {

  const [ books, setBooks ] = useState([])
  const [ favoriteGenre, setFavoriteGenre ] = useState(null)

  const [ getBooksByGenre, booksResult ] = useLazyQuery(
    BOOKS_BY_GENRE, {
      variables: { genre: favoriteGenre }
    }
  )

  const meResult = useQuery(ME)

  useEffect(() => {
    setFavoriteGenre(null)
    meResult.refetch()
  }, [ props.token ]) //eslint-disable-line

  useEffect(() => {
    if (favoriteGenre) {
      getBooksByGenre()
    }
  }, [ favoriteGenre ]) //eslint-disable-line

  useEffect(() => {
    if (meResult.data && meResult.data.me) {
      setFavoriteGenre(meResult.data.me.favoriteGenre)
    }
  }, [ meResult.data ]) //eslint-disable-line

  useEffect(() => {
    if (booksResult.data) {
      setBooks(booksResult.data.allBooks)
    }
  }, [ booksResult.data ])

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h3>Recommendations</h3>
      <h4>favorite genre: {favoriteGenre}</h4>
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
          {books
            .map(a =>
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            )}
        </tbody>
      </table>
    </div>

  )
}

export default Recommendations