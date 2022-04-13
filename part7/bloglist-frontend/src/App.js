import React, { useState, useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import { initializeBlogs, createBlog } from './reducers/blogReducer'
import { setNotification } from './reducers/notificationReducer'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './reducers/userReducer'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import BlogExtended from './components/BlogExtended'
import { Nav, Button } from 'react-bootstrap'

const App = () => {
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const blogFormRef = useRef()


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
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
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
      dispatch(setNotification('', 0))
    } catch (exception) {
      dispatch(setNotification('Wrong credentials', 5))
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(setUser(null))
  }

  const handleNewBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.setToken(user.token)
    dispatch(createBlog(blogObject))
    dispatch(
      setNotification(
        `a new blog '${blogObject.title}' by ${blogObject.author} added`
      )
    )
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
    <Togglable buttonLabel="create new" ref={blogFormRef}>
      <BlogForm
        handleNewBlog={handleNewBlog} />
    </Togglable>
  )

  const Home = () => {
    return (
      <div >{blogForm()}{blogs.slice().sort((a, b) => b.likes - a.likes).map((blog) =>
        <Blog key={blog.id} blog={blog} />
      )}</div>

    )
  }

  return (
    <div className="container">
      <div>
        <Router>
          {user === null ?
            <div>
              <Nav>

                <Nav.Link as={Link} to={'/'}>blog</Nav.Link>
                <Nav.Link as={Link} to={'/users'}>users</Nav.Link>
              </Nav>
              <Notification />
              {loginForm()}
            </div>
            :
            <div>
              <Nav>
                <Nav.Link as={Link} to={'/'}>blog</Nav.Link>
                <Nav.Link as={Link} to={'/users'}>users</Nav.Link>
                <Nav.Link eventKey="disabled" disabled>{user.name} logged in</Nav.Link>
                <Button id='logout' onClick={handleLogout}>logout</Button>
              </Nav>
              <h1>blogs</h1>
              <Notification />
              <Routes>
                <Route path='/' element={Home()} />
                <Route path='/users' element={<Users />} />
                <Route path='/users/:id' element={<User />}/>
                <Route path='/blogs/:id' element={<BlogExtended />}/>
              </Routes>
            </div>
          }
        </Router>
      </div>
    </div>
  )
}

/*      {user === null ?
        <div>
          <h1>log in to application</h1>
          <Notification />
          {loginForm()}
        </div>
        :
        <div>
          <h1>blogs</h1>
          <Notification />
          <p>{user.name} logged in</p>
          <button id='logout' onClick={handleLogout}>logout</button>
          {blogForm()}
        </div>
      }
       */
export default App