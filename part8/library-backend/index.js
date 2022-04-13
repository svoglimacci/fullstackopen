const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.SECRET

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB', error.message)
    })

const typeDefs = gql`

 type User {
     username: String!
     favoriteGenre: String!
     id: ID!
 }

 type Token {
     value: String!
 }

 type Book {
    title: String!
    published: Int
    author: Author!
    id: ID!
    genres: [String!]!

 }

 type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
 }

  type Query {
      bookCount: Int!
      authorCount: Int!
      allBooks(author: String, genre: String): [Book!]!
      allAuthors: [Author!]!
      me: User
  }

  type Mutation {
      createUser(
          username: String!
          favoriteGenre: String!
      ) : User
      login(
          username: String!
          password: String!
      ) : Token
      addBook(
        title: String!
        published: Int!
        author: String!
        genres: [String!]!
      ) : Book
      editAuthor(
          name: String!
          setBornTo: Int!
      ): Author
  }
`

const resolvers = {
  Query: {
      bookCount:  async () => Book.collection.countDocuments(),
      authorCount: async () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {

        if (args.author) {
          const foundAuthor = await Author.findOne({ name: args.author })
          if (foundAuthor) {
            if (args.genre) {
              return await Book.find({ author: foundAuthor.id, genres: { $in: [args.genre] } }).populate('author')
            }
            return  await Book.find({ author: foundAuthor.id }).populate('author')
          }
          return null
        }

        if (args.genre) {
          return Book.find({ genres: { $in: [args.genre] } }).populate('author')
        }

        return Book.find({}).populate('author')

      },
      allAuthors: async () => await Author.find({}),
      me: (root, args, context) => {
        return context.currentUser
      }
    },

  Author: {
      bookCount: async(root) => {
          const findAuthor = await Author.findOne({ name: root.name })
          const findBooks = await Book.find({ author: findAuthor})
          return findBooks.length
      }
  },

  Mutation: {
      createUser: async (root, args) => {
          const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
          return user.save()
          .catch(error => {
              throw new UserInputError(error.message, {
                  invalidArgs: args,
              })
          })
      },
      login: async (root, args) => {
          const user = await User.findOne({ username: args.username })

          if ( !user || args.password !== 'secret' ) {
              throw new UserInputError("wrong credentials")
          }

          const userForToken = {
              username: user.username,
              id: user._id,
          }

          return { value: jwt.sign(userForToken, JWT_SECRET) }
      },
      addBook: async (root, args, context) => {
        const findAuthor = await Author.findOne({ name: args.author })
        const findBook = await Book.findOne({ title: args.title})
          const user = context.currentUser

          if (!user) {
            throw new AuthenticationError("not authenticated")
          }

          if (findBook) {
              throw new UserInputError('Book already exists', {
                  invalidArgs: args.title,
              })
          }
          if (!findAuthor) {
              const author = new Author({ "name": args.author })
              try {
                  await author.save()
              } catch (error) {
                  throw new UserInputError(error.message, { invalidArgs: args,})
              }
          }
          const foundAuthor = await Author.findOne({ name: args.author })
          const book = new Book({ ...args, author: foundAuthor })

          try {
              await book.save()
          } catch (error) {
              throw new UserInputError(error.message, {
                  invalidargs: args,
              })
          }
      },
      editAuthor: async (root, args, context) => {
          const author = await Author.findOne({ name: args.name})
          const user = context.currentUser

          if(!user) {
            throw new AuthenticationError("not authenticated")
        }
        if (!author) {
            return null
          }


      await Author.updateOne({name: args.name}, { $set: { born: args.setBornTo}})
      return await Author.findOne({ name: args.name })
    },
      }

  }

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
          const decodedToken = jwt.verify(
              auth.substring(7), JWT_SECRET
          )
          const currentUser = await User.findById(decodedToken.id)
          return { currentUser  }
      }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})