import { gql } from 'graphql-tag'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {
      name
    }
    published
    genres
    id
  }
`

export const ME = gql`
  query me {
    me {
      username
      favoriteGenre
      id
    }
  }
`

export const LOGIN = gql`
  mutation login(
    $username: String!,
    $password: String!
  ) {
    login(
      username: $username,
      password: $password
    ) {
      value
    }
  }
`

export const ADD_BOOK = gql`
  mutation addBook(
    $title: String!, 
    $author: AuthorInput!,
    $published: Int!,
    $genres: [String!]!
    ) {
      addBook(
        title: $title,
        author: $author,
        published: $published,
        genres: $genres
      ) {
        title
        author {
          name
        }
        published
        genres
        id
      }
    }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`

export const EDIT_BIRTH_YEAR = gql`
  mutation editAuthor(
    $name: String!,
    $born: Int!
  ) {
    editAuthor(
      name: $name
      setBornTo: $born
    ) {
      name
      born
      id
    }
  }
`

export const ALL_AUTHORS  = gql`
  query allAuthors {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query allBooks {
    allBooks {
      title
      author {
        name
      }
      published
      id
      genres
    }
  }
`

export const BOOKS_BY_GENRE = gql`
  query booksByGenre($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
        born
      }
      published
      id
      genres
    }
  }
`