import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMatch, useNavigate } from 'react-router-dom'
import { likeBlog, removeBlog, commentBlog } from '../reducers/blogReducer'
import { Button, Form } from 'react-bootstrap'
const blogExtended = () => {
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null


  const handleLike = async (blog) => {
    dispatch(likeBlog(blog))
  }

  const handleRemove = async (blog) => {
    dispatch(removeBlog(blog, user))
    navigate('/')
  }

  const handleComment = async (event) => {
    event.preventDefault()
    dispatch(commentBlog(blog.id, comment))
    setComment('')
  }

  const handleCommentChange = (event) => {
    setComment(event.target.value)
  }

  if (!blog) {
    return null
  }
  return (
    <div>
      <h2>{blog.title}</h2>
      <div><a href={`https://${blog.url}`}>{blog.url}</a></div>
      <div>{blog.likes} <Button onClick={() => handleLike(blog)}>like</Button></div>
      <div>added by {blog.author}</div>
      {blog.user.name === user.name ? (
        <Button onClick={() => handleRemove(blog)}>remove</Button>
      ) : null}
      <h3>comments</h3>
      <Form onSubmit={handleComment}>
        <Form.Control value={comment} onChange={handleCommentChange} />
        <Button type='submit'>add comment</Button>
      </Form>
      <ul>
        {blog.comments.map((comment) => (
          <li key={Math.random()}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default blogExtended