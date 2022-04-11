import { useState } from 'react'
import { ALL_AUTHORS, EDIT_BORN } from '../queries'
import { useMutation, useQuery } from '@apollo/client'

const Authors = (props) => {
    const [setBornTo, setBorn] = useState('')
    const result = useQuery(ALL_AUTHORS)
    const [name, setName] = useState('')

    const [ editBorn ] = useMutation(EDIT_BORN, {
        refetchQueries: [
            { query: ALL_AUTHORS }
          ],
      })

  if (!props.show || result.loading) {
    return null
  }

  const submit = async (event) => {
    console.log('change born...')
    editBorn({ variables : { name, setBornTo } })
    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
          <div>name<select defaultValue={'DEFAULT'} onChange={({ target }) => setName(target.value)}><option value="DEFAULT" disabled>Select an Author</option>{result.data.allAuthors.map((a) => (
              <option key={a.name} value={a.name}>{a.name}</option>
          ))}</select></div>
          <div>born<input value={setBornTo} onChange={({ target }) => setBorn(parseInt(target.value))}></input></div>
          <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
