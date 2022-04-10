const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({
        username: 'root',
        name: 'admin',
        blogs: [],
        passwordHash
    })

    await user.save()
})

beforeEach(async () => {
    await Blog.deleteMany({})
    const users = await User.find({})
    const user = users[0]
    const id = users[0]._id

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog({
            title: blog.title,
            author: blog.author,
            url: blog.url,
            user: id.toString(),
            likes: blog.likes || 0
        }))

    const promiseArray = blogObjects.map(blog => {
        blog.save()
        user.blogs = user.blogs.concat(blog._id)
    })
    await Promise.all(promiseArray)
    await user.save()
})

test('the unique identifier property of a blog is named id', async () => {
    const blogs = await Blog.find({})
    expect(blogs[0].id).toBeDefined()
})

describe('Testing GET requests', () => {
    test('blogs are returned as json', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)

    })
    test('a specific blog can be viewed', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const blogToView = blogsAtStart[0]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

        expect(resultBlog.body).toEqual(processedBlogToView)
    })
})
describe('Testing POST requests', () => {
    let headers

    beforeEach(async () => {
        const user = {
            username: 'root',
            password: 'password',
        }

        const loginUser = await api
            .post('/api/login')
            .send(user)

        headers = {
            'Authorization': `bearer ${loginUser.body.token}`
        }
    })
    test('a valid blog can be added', async () => {
        const newBlog = {
            id: '5a422bc61b54a676234d17fc',
            title: 'Type wars',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
            likes: 2,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .set(headers)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(n => n.title)
        expect(titles).toContain(
            'Type wars'
        )
    })

    test('blog without token is not added', async () => {
        const newBlog = {
            id: '5a422bc61b54a676234d17fc',
            title: 'Type wars',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
            likes: 2,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })

    test('blog without title and url is not added', async () => {
        const newBlog = {
            id: '5a422bc61b54a676264d17fc',
            author: 'Robert C. Martin',
            likes: 2,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
            .set(headers)
            .expect('Content-Type', /application\/json/)


        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('blog without likes default to 0', async () => {
        const newBlog = {
            id: '5a422bc61b54a676234d17fc',
            title: 'Type wars',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .set(headers)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const blogToTest = await blogsAtEnd.find(r => r.title === 'Type wars')
        expect(blogToTest.likes).toBe(0)
    })
})

describe('Testing DELETE requests', () => {
    let headers
    beforeEach(async () => {
        const user = {
            username: 'root',
            password: 'password',
        }

        const loginUser = await api
            .post('/api/login')
            .send(user)

        headers = {
            'Authorization': `bearer ${loginUser.body.token}`
        }
    })

    test('a blog can be deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
            .set(headers)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length - 1
        )

        const titles = blogsAtEnd.map(r => r.title)

        expect(titles).not.toContain(blogToDelete.title)
    })
})


describe('Testing PUT requests', () => {
    let headers
    beforeEach(async () => {
        const user = {
            username: 'root',
            password: 'password',
        }

        const loginUser = await api
            .post('/api/login')
            .send(user)

        headers = {
            'Authorization': `bearer ${loginUser.body.token}`
        }
    })
    test('a blog can be updated', async () => {

        const newBlog = {
            id: '5a422bc61b54a676234d17fc',
            title: 'Type wars',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
            likes: 2,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .set(headers)

        const allBlogs = await helper.blogsInDb()
        const blogToUpdate = allBlogs.find(blog => blog.title === newBlog.title)

        const updatedBlog = {
            ...blogToUpdate,
            likes: blogToUpdate.likes + 1
        }

        await api
            .put('/api/blogs/${blogToUpdate.id}')
            .send(updatedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        const foundBlog = blogsAtEnd.find(blog => blog.likes === 3)
        expect(foundBlog.likes).toBe(3)
    })

})

afterAll(() => {
    mongoose.connection.close()
})