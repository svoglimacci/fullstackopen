import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        changeNotification(state, action) {
            const notification = action.payload
            return notification
        },
        resetNotification(state, action) {
            return null
        }
    }
})

/*
const notificationReducer = (state = initialState, action) => {
    console.log('ACTION: ', action)
    switch (action.type) {
        case 'NOTIFICATION_SUCCESS':
            return action.notification
        default:
            return state
    }
}

export const changeNotification = notification => {
    return {
        type: 'NOTIFICATION_SUCCESS',
        notification,
    }
}
*/
export const { changeNotification, resetNotification } = notificationSlice.actions
export default notificationSlice.reducer