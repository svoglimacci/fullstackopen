import { useQuery } from '@apollo/client'
import { ME, ALL_BOOKS } from '../queries'


const Recommended = ( props ) => {
    const user = useQuery(ME)
    const result = useQuery(ALL_BOOKS)

    if (!props.show || !user) {
        return null
    }

    if (result.loading) {
        return <div>loading...</div>
    }
    return (
        <div>
            <h2>recommendations</h2>
            <p>books from your favorite genre <strong>{user.data.me.favoriteGenre}</strong></p>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {result.data.allBooks.filter(book => book.genres.includes(user.data.me.favoriteGenre)).map(a =>
                        <tr key={a.title}>
                            <td>{a.title}</td>
                            <td>{a.author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )

}

export default Recommended

/*{
  "data": {
    "me": {
      "username": "svoglimacci",
      "favoriteGenre": "test",
      "id": "6255c9c33ae4a79ee32ebfea"
    }
  }
} */