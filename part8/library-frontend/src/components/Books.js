import { ALL_BOOKS } from '../queries'
import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'

const Books = (props) => {
    const result = useQuery(ALL_BOOKS)
    const [filter, setFilter] = useState('any')
    console.log(result.data)
    const [genres, setGenres] = useState(['any'])

    useEffect(() => {
    if(result.data) {
        result.data.allBooks.forEach((book) => {
            book.genres.forEach((genre => {
                if (genres.indexOf(genre) === -1) {
                    genres.push(genre)
                }
            }))
        })
        setGenres(genres)

    }
},[result])

  if (!props.show || result.loading) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
        {filter !== 'any' ? <p>in genre {filter}</p> : null}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {result.data.allBooks.filter(book => filter === 'any' ? book : book.genres.includes(filter)).map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      {genres.map(a =>
        <button key={a} onClick={() => setFilter(a)}>{a}</button>
      )}
    </div>
  )
}

export default Books
