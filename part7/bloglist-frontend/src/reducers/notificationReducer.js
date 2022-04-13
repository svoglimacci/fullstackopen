import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    showNotification(state, action) {
      const notification = action.payload
      return notification
    },
    resetNotification() {
      return null
    },
  },
})

let timeoutID

export const setNotification = (notification, time) => {

  return async dispatch => {
    dispatch(showNotification(notification))
    if (timeoutID) { clearTimeout(timeoutID) }

    timeoutID = setTimeout(() => {
      dispatch(resetNotification())
    }, time * 1000)
  }
}

export const { showNotification, resetNotification } = notificationSlice.actions
export default notificationSlice.reducer