require('dotenv').config()

const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError
} = require('apollo-server')

const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')

console.log('connecting to DB...')
mongoose
  .connect(
    process.env.GQL_AUTHORS_MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }
  )
  .then(() => console.log('connected to DB!'))

const typeDefs = gql`

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    born: Int
    id: ID!
  }

  input AuthorInput {
    name: String!
    born: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type AuthorDetails {
    name: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(authorName: String, genre: String): [Book!]!
    allAuthors: [AuthorDetails]
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: AuthorInput!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.estimatedDocumentCount(),
    authorCount: () => Author.estimatedDocumentCount(),
    allBooks: async (root, args) => {
      let booksToReturn = await Book.find({}).populate('author')

      if (args.authorName) {
        booksToReturn = booksToReturn.filter(b =>
          b.author.name === args.authorName
        )
      }

      if (args.genre) {
        booksToReturn = booksToReturn.filter(b =>
          b.genres
            .map(g => g.toLowerCase())
            .includes(args.genre.toLowerCase())
        )
      }

      return booksToReturn
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      const books = await Book.find({}).populate('author')

      return authors.map(a => {
        const bookCount =
          books
            .filter(b => b.author.name === a.name)
            .length
        return {
          name: a.name,
          born: a.born,
          bookCount
        }
      })
    },
    me: (root, args, context) => context.currentUser
  },
  Mutation: {
    addBook: async (root, args, context) => {

      if (!context.currentUser) {
        throw new AuthenticationError('User not logged in!')
      }

      let newAuthor = await Author.findOne(
        { name: { $eq: args.author.name } }
      )

      if (!newAuthor) {
        try {
          newAuthor = await new Author({
            name: args.author.name
          }).save()
        } catch (exception) {
          throw new UserInputError(
            exception.message, // this might be an issue
            { invalidArgs: args }
          )
        }
      }

      const newBook = new Book({
        ...args,
        author: newAuthor
      })

      let savedBook
      try {
        savedBook = await newBook.save()
      } catch (exception) {
        throw new UserInputError(
          exception.message,
          { invalidArgs: args }
        )
      }

      return savedBook
    },
    editAuthor: async (root, args, context) => {

      if (!context.currentUser) {
        throw new AuthenticationError('User not logged in!')
      }

      let authorToChange

      try {
        authorToChange = await Author.findOneAndUpdate(
          { name: { $eq: args.name } },
          { born: args.setBornTo },
          { new: true }
        )
      } catch (exception) {
        throw new UserInputError(
          exception.message,
          { invalidArgs: args }
        )
      }

      return authorToChange
    },
    createUser: async (root, args) => {
      let user
      try {
        user = await new User({
          username: args.username,
          favoriteGenre: args.favoriteGenre
        }).save()
      } catch(exception) {
        throw new UserInputError(
          exception.message,
          { invalidArgs: args }
        )
      }
      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({
        username: args.username
      })

      if (!user) {
        throw new UserInputError(
          'User does not exist!',
          { invalidArgs: args.username }
        )
      }

      if (args.password !== process.env.RANDOM_PASSWORD) {
        throw new UserInputError('Invalid password.')
      }

      const token = {
        value: jwt.sign({
          username: user.username,
          id: user._id
        }, process.env.SECRET)
      }

      return token
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null

    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.SECRET
      )

      const currentUser = await User
        .findById(
          decodedToken.id
        )

      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})