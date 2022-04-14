import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`;

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
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
const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {
      name
      born
      bookCount
      id
    }
    published
    genres
    id
  }
`;

export const BOOK_ADDED = gql`
subscription {
    bookAdded {
        ...bookDetails
    }
}

${BOOK_DETAILS}
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`;