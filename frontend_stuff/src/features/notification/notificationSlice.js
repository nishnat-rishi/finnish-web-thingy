import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    message: null,
    status: 'success'
  },
  reducers: {
    setNotification: (state, action) => {
      Object.assign(state, action.payload)
    },
    resetNotification: state => {
      state.message = null
    },
  }
})

export const selectNotificationMessage = state =>
  state.notification.message
export const selectNotificationStatus = state =>
  state.notification.status

export const {
  setNotification,
  resetNotification
} = notificationSlice.actions

export default notificationSlice