import React, { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  const buttonLabel = visible ? 'hide' : 'view'


  return (
    <div style={blogStyle} className="blog" >
      <div>
        {blog.title} - {blog.author} <button onClick={toggleVisibility} > {buttonLabel}</button>
      </div >
      <div style={showWhenVisible} className="info">
        <p>{blog.url}</p>
        <p id='likes'>{blog.likes} <button onClick={handleLike}>like</button></p>
        <p>{blog.author}</p>
        <button id='delete' onClick={handleDelete}>remove</button>
      </div>
    </div>
  )
}

export default Blog