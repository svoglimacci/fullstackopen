
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'
import '@testing-library/jest-dom/extend-expect'

test('Form calls the event handler as props with the right details when a new blog is created', () => {

  const mockHandler = jest.fn()

  const { container } = render(
    <BlogForm handleNewBlog={mockHandler} />
  )

  const title = container.querySelector('#title')
  const author = container.querySelector('#author')
  const url = container.querySelector('#url')
  const form = container.querySelector('#form')

  fireEvent.change(title, { target: { value: 'title' } })
  fireEvent.change(author, { target: { value: 'author' } })
  fireEvent.change(url, { target: { value: 'url' } })
  fireEvent.submit(form)

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe('title')
  expect(mockHandler.mock.calls[0][0].author).toBe('author')
  expect(mockHandler.mock.calls[0][0].url).toBe('url')

  screen.debug()
})