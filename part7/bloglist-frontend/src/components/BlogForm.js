import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
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

    <Form id="form" onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control id="title"
          name='Title'
          value={title}
          onChange={handleTitleChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Author</Form.Label>
        <Form.Control id="author"
          name='Author:'
          value={author}
          onChange={handleAuthorChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Url</Form.Label>
        <Form.Control id="url"
          name='Url'
          value={url}
          onChange={handleUrlChange}
        />
      </Form.Group>
      <Button type="submit">save</Button>
    </Form>
  </div>
  )
}

export default BlogForm