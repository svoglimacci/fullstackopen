import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'

const Anecdote = ({ anecdote }) => {
    const dispatch = useDispatch()
    return (
        <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>{anecdote.votes} <button onClick={() => dispatch(vote(anecdote.id))}>vote</button></div>
        </div>
    )
}

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state)
    const byVotes = (a, b) => b.votes - a.votes

    return (
        anecdotes.sort(byVotes).map(anecdote => <Anecdote anecdote={anecdote} />)
    )
}

export default AnecdoteList