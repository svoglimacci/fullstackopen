const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const JWT_SECRET = process.env.SECRET

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {

            if (args.author) {
                const foundAuthor = await Author.findOne({ name: args.author })
                if (foundAuthor) {
                    if (args.genre) {
                        return await Book.find({ author: foundAuthor.id, genres: { $in: [args.genre] } }).populate('author')
                    }
                    return await Book.find({ author: foundAuthor.id }).populate('author')
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
        bookCount: async (root) => {
            let bookCount = (await Book.find({author: root._id})).length
            return bookCount
          },
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

            if (!user || args.password !== 'secret') {
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
            const findBook = await Book.findOne({ title: args.title })
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
                    throw new UserInputError(error.message, { invalidArgs: args, })
                }
            }
            const foundAuthor = await Author.findOne({ name: args.author })
            const book = new Book({ ...args, author: foundAuthor })

            try {
                await book.save()
                pubsub.publish('BOOK_ADDED', { bookAdded: book })
                return book
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidargs: args,
                })
            }
        },
        editAuthor: async (root, args, context) => {
            const author = await Author.findOne({ name: args.name })
            const user = context.currentUser

            if (!user) {
                throw new AuthenticationError("not authenticated")
            }
            if (!author) {
                return null
            }


            await Author.updateOne({ name: args.name }, { $set: { born: args.setBornTo } })
            return await Author.findOne({ name: args.name })
        },
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
        },
    },



}

module.exports = resolvers