import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        showNotification(state, action) {
            const notification = action.payload
            return notification
        },
        resetNotification(state, action) {
            return null
        },
    },
})

export const setNotification = (notification, time) => {

    return async dispatch => {
        dispatch(showNotification(notification))
        setTimeout(() => {
            dispatch(resetNotification())
        }, time * 1000)
    }
}

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
export const { showNotification, resetNotification } = notificationSlice.actions
export default notificationSlice.reducer