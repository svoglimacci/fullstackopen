import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { changeNotification, resetNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote }) => {
    const dispatch = useDispatch()
    return (
        <div >
            <div>{anecdote.content}</div>
            <div>{anecdote.votes}
                <button onClick={() => {
                    dispatch(vote(anecdote.id))
                    dispatch(changeNotification(`you voted '${anecdote.content}'`))
                    setTimeout(() => {
                        dispatch(resetNotification())
                    }, 3000)
                }
                }>vote</button></div>
        </div>
    )
}

const AnecdoteList = () => {
    const anecdotes = useSelector(({ filter, anecdotes }) => {
        if ( filter === 'ALL' || filter === '' ) {
            return anecdotes.slice().sort((a, b) => b.votes - a.votes)
        }
        return anecdotes.filter(element => element.content.toLowerCase().indexOf(filter.toLowerCase()) !== -1).sort((a, b) => b.votes - a.votes)
    })


    return (
        <div>
            {anecdotes.map(anecdote =>
                <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                />
            )}
        </div>
    )
}

export default AnecdoteList