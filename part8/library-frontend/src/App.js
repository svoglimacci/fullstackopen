import { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'

const Notify = ({ errorMessage }) => {
    if (!errorMessage) {
      return null
    }
    return <div style={{ color: 'red' }}>{errorMessage}</div>
  }

const App = () => {
    const [errorMessage, setErrorMessage] = useState(null)
    const [token, setToken] = useState(null)
    const [page, setPage] = useState('authors')
    const client = useApolloClient()

    const logout = () => {
        setToken(null)
        localStorage.clear()
        client.resetStore()
      }

      const notify = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
          setErrorMessage(null)
        }, 10000)
      }

    if (!token) {
        return (
            <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('login')}>login</button>
      </div>
      <Notify errorMessage={errorMessage} />
      <Authors show={page === 'authors'} notify={notify}/>
      <Books show={page === 'books'} notify={notify} />
      <LoginForm show={page === 'login'} setToken={setToken} setError={notify}  />
    </div>
        )
    }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommended')}>recommend</button>
        <button onClick={logout}>logout</button>
      </div>
      <Notify errorMessage={errorMessage} />
      <Authors show={page === 'authors'} notify={notify}/>
      <Books show={page === 'books'} notify={notify} />
      <NewBook show={page === 'add'} notify={notify} />
      <Recommended show={page === 'recommended'}/>
    </div>
  )
}

export default App
