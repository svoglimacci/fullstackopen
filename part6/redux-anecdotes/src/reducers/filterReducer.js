import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
    name: 'filter',
    initialState: 'ALL',
    reducers: {
        changeFilter(state, action) {
            const filter = action.payload
            return filter
        }
    }
})

/*
const filterReducer = (state = 'ALL', action) => {
    switch (action.type) {
        case 'SET_FILTER':
          return action.filter
        default:
          return state
      }
  }

  export const changeFilter = filter => {
    return {
      type: 'SET_FILTER',
      filter,
    }
  }
*/

export const { changeFilter } = filterSlice.actions
export default filterSlice.reducer