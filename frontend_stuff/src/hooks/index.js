import { useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

import { ALL_AUTHORS } from '../queries_mutations'

export const useAuthors = () => {
  const result = useQuery(ALL_AUTHORS)

  const [ authors, setAuthors ] = useState([])

  useEffect(() => {
    if (result.data && result.data.allAuthors) {
      setAuthors(result.data.allAuthors)
    }
  }, [ result ])

  return authors
}