import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'
/*
const anecdotesAtStart = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]


const asObject = (anecdote) => {
    return {
        content: anecdote,
        id: generateId(),
        votes: 0
    }
}

const initialState = anecdotesAtStart.map(asObject)

const generateId = () =>
    Number((Math.random() * 1000000).toFixed(0))
*/

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        /*createAnecdote(state, action) {
           state.push(action.payload)
        },*/
        vote(state, action) {
            const id = action.payload
            const anecdoteToChange = state.find(n => n.id === id)
            const changedAnecdote = {
                ...anecdoteToChange,
                votes: anecdoteToChange.votes + 1
            }
            return state.map(anecdote =>
                anecdote.id !== id ? anecdote : changedAnecdote
            )
        },
        appendAnecdote(state, action) {
            state.push(action.payload)
        },
        setAnecdotes(state, action) {
            return action.payload
        }
    },
})
/*
const anecdoteReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'NEW_ANECDOTE':
            return [...state, action.data]
        case 'VOTE':
            const id = action.data.id
            const anecdoteToChange = state.find(n => n.id === id)
            const changedAnecdote = {
                ...anecdoteToChange,
                votes: anecdoteToChange.votes + 1
            }
            return state.map(anecdote =>
                anecdote.id !== id ? anecdote : changedAnecdote
            )
        default:
            return state
    }
}

export const createAnecdote = (content) => {
    return {
        type: 'NEW_ANECDOTE',
        data: {
            content,
            votes: 0,
            id: generateId()
        }
    }
}

export const vote = (id) => {
    return {
        type: 'VOTE',
        data: { id }
    }
}
*/

export const { vote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll()
        dispatch(setAnecdotes(anecdotes))
    }
}

export const createAnecdote = content => {
    return async dispatch => {
        const newAnecdote = await anecdoteService.createNew(content)
        dispatch(appendAnecdote(newAnecdote))
    }
}
/*const vote = async anecdote => {

    const response = await axios.put(
      `${baseUrl}/${anecdote.id}`,
      { ...anecdote, votes: anecdote.votes + 1 },
    )
    return response.data
  }
 */
export const voteAnecdote = (anecdote) => {
    return async dispatch => {
        const newVote = { ...anecdote, votes: anecdote.votes + 1 }
        const updatedAnecdote = await anecdoteService.update(anecdote.id, newVote)
        dispatch(vote(updatedAnecdote.id))
    }
}

export default anecdoteSlice.reducer