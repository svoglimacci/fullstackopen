import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query {
    allAuthors {
        name
        born
        bookCount
    }
}
`

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

export const ALL_BOOKS = gql`
query {
  allBooks {
    title
    published
    genres
    author {
      name
    }
  }
}
`

export const ADD_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!){
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title,
    published,
    genres,
    author {
        name
    }
  }
}
`
export const EDIT_BORN = gql`
mutation editBorn($name: String!, $setBornTo: Int!){
    editAuthor(
        name: $name,
        setBornTo: $setBornTo
    ) {
        name,
        born
    }
}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`