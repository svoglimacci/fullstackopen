import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'
const Notification = () => {
  const message = useSelector(({ notification }) => notification)
  if (message === null) {
    return null
  }

  return (
    <Alert className="error">
      {message}
    </Alert>
  )
}

export default Notification