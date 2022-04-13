import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data
}
/*
const like = async blog => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.put(
    `${baseUrl}/${blog.id}`,
    { ...blog, likes: blog.likes + 1 },
    config
  )
  return response.data
}
*/

const remove = async blog => {
  const config =  {
    headers: { Authorization: token }
  }

  const response = await axios.delete(
    `${baseUrl}/${blog.id}`,
    config
  )
  return response.data
}

const comment = async (blog, comment) => {
  const response = await axios.post(`${baseUrl}/${blog}/comments`, {
    comment,
  })
  return response.data
}
export default { getAll, create, update, remove, setToken, comment }