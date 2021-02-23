import React, { useImperativeHandle, useState } from 'react'

const Notification = React.forwardRef((props, ref) => {
  const [status, setStatus] = useState('success')
  const [message, setMessage] = useState(null)

  const show = (message, status = 'success') => {
    setStatus(status)
    setMessage(message)
    setTimeout(() => setMessage(null), 5000)
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