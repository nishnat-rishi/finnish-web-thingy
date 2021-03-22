import React, { useImperativeHandle, useState } from 'react'
import {
  Message,
  Sticky,
  Transition
} from 'semantic-ui-react'

const Notification = React.forwardRef(
  (
    { fullPageRef },
    ref
  ) => {

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
          // window.setTimeout(() => {  // debugging
          //   show('again!')
          // }, 1000)
        }, 4000)
      )
    }

    useImperativeHandle(
      ref,
      () => ({ show })
    )

    const messageStatus = () =>
      status === 'success'
        ? { positive: true }
        : { negative: true }

    return (
      <Sticky
        context={fullPageRef}
        style={{
          height: 0
        }}
        styleElement={{
          height: 0,
          paddingTop: 10
        }}
      >
        <Transition
          visible={visible}
          animation='slide down'
          duration={500}
        >
          <Message  // can make this dismissible using onDismiss!*(2)
            {...messageStatus()}
            content={message}
            style={{
              textAlign: 'center',
            }}
          >
          </Message>
        </Transition>
      </Sticky>
    )
  }
)

Notification.displayName = 'Notification'

export default Notification


/*
  Additional Comments:
  --------------------

  1.(HYPOTHESIS) The issue here is that the original page
    (i.e. HomePage) has not been 'Semanticified'. This implies
    that when we try to make our message width be '100%', we
    get weird shortening due to the original page exceeding the
    width beyond the current viewport. (THE TRANSITION NEEDED THE
    STYLE, NOT ANY CONTAINER SURROUNDING IT! (idk how this works
    fully...))

  2.This Message component has to be a sticky so that no matter
    how far we've scrolled down, we can still see useful info
    being relayed to us. And it has to be dismissible for
    uhh aesthetic reasons. (IT WORKED, STICKIED TO THE TOPMOST DIV
    (weirdly it doesn't work with a "top"ish level container))

*/