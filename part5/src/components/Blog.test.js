import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen, fireEvent } from '@testing-library/react'
import Blog from './Blog'


test('title and author are displayed, url and likes are not', () => {
  const blog = {
    title: 'title',
    author: 'author',
    url: 'google.com',
    likes: 1
  }
  const user = ''

  const { container } = render(<Blog blog={blog} user={user} />)

  const div = container.querySelector('.blog')
  const info = container.querySelector('.info')
  expect(div).toHaveTextContent('title - author')
  expect(info).toHaveStyle('display: none')
})


test('when clicking the button, url and likes are displayed', () => {
  const blog = {
    title: 'title',
    author: 'author',
    url: 'google.com',
    likes: 1
  }
  const user = ''

  const { container } = render(<Blog blog={blog} user={user} />)
  const info = container.querySelector('.info')
  const button = screen.getByText('view')
  fireEvent.click(button)
  expect(info).toHaveTextContent('google.com1')
  expect(info).toHaveStyle('display: block')
})

test('when clicking the like button twice, the event handler is called twice', () => {
  const blog = {
    title: 'title',
    author: 'author',
    url: 'google.com',
    likes: 1
  }
  const user = ''
  const mockHandler = jest.fn()
  render(<Blog blog={blog} user={user} handleLike={mockHandler} />)
  const button = screen.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)


})