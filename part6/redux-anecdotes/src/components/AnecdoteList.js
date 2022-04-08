import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification} from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleClick }) => {
    return (
        <div >
            <div>{anecdote.content}</div>
            <div>{anecdote.votes}
                <button onClick={handleClick}>vote</button></div>
        </div>
    )
}

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(({ filter, anecdotes }) => {
        if (filter === 'ALL' || filter === '') {
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
                    handleClick={() => {

                        dispatch(voteAnecdote(anecdote))
                        dispatch(setNotification(`you voted '${anecdote.content}'`, 5))

                    }}
                />
            )}
        </div>
    )
}

export default AnecdoteList
