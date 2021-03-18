import React, { useImperativeHandle, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectNotificationMessage,
  selectNotificationStatus,
  setNotification,
  resetNotification
} from '../features/notification/notificationSlice'

import './Notification.css'

const Notification = React.forwardRef((props, ref) => {

  const dispatch = useDispatch()

  const status = useSelector(selectNotificationStatus)
  const message = useSelector(selectNotificationMessage)

  const [ notificationTimeout, setNotificationTimeout ] = useState(null)

  const show = (message, status = 'success') => {
    window.clearTimeout(notificationTimeout)
    dispatch(setNotification({ message, status }))
    setNotificationTimeout(
      window.setTimeout(() => {
        dispatch(resetNotification())
      }, 5000)
    )
  }
  useImperativeHandle(
    ref, () => ({ show })
  )

  return (
    message
      ?
      <div className={status}>
        {message}
      </div>
      :
      <div></div>
  )
})

Notification.displayName = 'Notification'

export default Notification