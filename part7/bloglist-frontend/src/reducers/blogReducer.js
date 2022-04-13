import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    like(state, action) {
      const id = action.payload
      const blogToChange = state.find(n => n.id === id)
      const changedBlog = {
        ...blogToChange,
        likes: blogToChange.likes + 1
      }
      return state.map(blog =>
        blog.id !== id ? blog : changedBlog
      )
    },
    appendBlogs(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    deleteBlog(state, action) {
      const { id } = action.payload
      return state.filter((item => item.id !== id))
    },
    setComment(state, action) {
      const changedBlog = action.payload
      return state.map((blog) => changedBlog.id === blog.id ? changedBlog : blog)
    }
  }
})

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = content => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch(appendBlogs(newBlog))
  }
}

export const likeBlog = (blog) => {
  return async dispatch => {
    const newLike = { ...blog, likes: blog.likes + 1 }
    const updatedBlog = await blogService.update(blog.id, newLike)
    dispatch(like(updatedBlog.id))
  }
}

export const removeBlog = (blog, user) => {
  return async dispatch => {
    blogService.setToken(user.token)
    await blogService.remove(blog)
    dispatch(deleteBlog(blog))
  }
}

export const commentBlog = (id, comment) => {
  return async (dispatch) => {
    const changedBlog = await blogService.comment(id, comment)
    dispatch(setComment(changedBlog))
  }
}

export const { appendBlogs, setBlogs, like, deleteBlog, setComment } = blogSlice.actions
export default blogSlice.reducer