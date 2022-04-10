import React, { useState, useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {

    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleNewBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility()
    event.preventDefault()
    try {
      await blogService
        .create(newBlog)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setErrorMessage(
            `Blog ${newBlog.title} was successfully added`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    } catch (exception) {
      setErrorMessage(`Cannot add ${newBlog.title}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

  }
  const handleLike = async (blog) => {
    const likedBlog = await blogService.like(blog)
    setBlogs(
      blogs.map(blog =>
        blog.id === likedBlog.id
          ? { ...blog, likes: likedBlog.likes }
          : blog
      )
    )
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
      await blogService.deleteBlog(blog)
      setBlogs(
        blogs.filter(currnetBlog => currnetBlog.id !== blog.id)
      )
    }
  }

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  )


  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm
        handleNewBlog={handleNewBlog} />
    </Togglable>
  )

  return (
    <div>
      {user === null ?
        <div>
          <h1>log in to application</h1>
          <Notification message={errorMessage} />
          {loginForm()}
        </div> :
        <div>
          <h1>blogs</h1>
          <Notification message={errorMessage} />
          <p>{user.name} logged in <button id='logout' onClick={handleLogout}>logout</button> </p>
          <h2>create new</h2>
          {blogForm()}
          <div >{blogs.sort((a, b) => b.likes - a.likes).map(blog =>
            <Blog key={blog.id} blog={blog} handleLike={() => handleLike(blog)} handleDelete={() => handleDelete(blog)} user={user.username} />
          )}</div>

        </div>
      }
    </div>
  )
}

export default App