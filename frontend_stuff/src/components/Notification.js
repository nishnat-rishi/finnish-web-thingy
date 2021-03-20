import React, { useImperativeHandle, useState } from 'react'
import { Message, Transition } from 'semantic-ui-react'

const Notification = React.forwardRef((props, ref) => {

  const [ status, setStatus ] = useState('success')
  const [ message, setMessage ] = useState('Welcome to the blog!')

  const [ visible, setVisible ] = useState(false)

  const [ visibleTimeout, setVisibleTimeout ] = useState(null)

  const show = (message, status = 'success') => {
    window.clearTimeout(visibleTimeout)

    setStatus(status)
    setMessage(message)

    setVisible(true)
    setVisibleTimeout(
      window.setTimeout(() => {
        setVisible(false)
      }, 5000)
    )
  }

  useImperativeHandle(
    ref, () => ({ show })
  )

  const messageStyle = () =>
    status === 'success'
      ? { positive: true }
      : { negative: true }

  return (
    <Transition
      visible={visible}
      animation='fade'
      duration={500}>
      <Message {...messageStyle()}>
        {message}
      </Message>
    </Transition>
  )
})

Notification.displayName = 'Notification'

export default Notification