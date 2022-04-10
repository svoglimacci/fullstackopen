import { useState } from 'react'

const BlogForm = ({ handleNewBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    handleNewBlog({
      title: title,
      author: author,
      url: url,
      likes: 0
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return ( <div>
    <h2>Add a new blog</h2>

    <form id="form" onSubmit={handleSubmit}>
      <input id="title"
        name='Title'
        value={title}
        onChange={handleTitleChange}
      />
      <input id="author"
        name='Author:'
        value={author}
        onChange={handleAuthorChange}
      />
      <input id="url"
        name='Url'
        value={url}
        onChange={handleUrlChange}
      />
      <button type="submit">save</button>
    </form>
  </div>
  )
}

export default BlogForm