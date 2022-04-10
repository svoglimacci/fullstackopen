const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log(
        'Please provide the password as an argument: node mongo.js <password>'
    )
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.g5rcs.mongodb.net/blogApp?retryWrites=true&w=majority`

mongoose.connect(url)

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
    title: 'Test Blog',
    author: 'Simon V.S.',
    url: 'test-blog',
    likes: 7
})

blog.save().then(() => {
    console.log('blog saved!')
    mongoose.connection.close()
})
