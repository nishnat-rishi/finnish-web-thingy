import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { logoutUser, selectUser } from '../features/user/userSlice'

import './NavigationBar.css'

const NavigationBar = () => {

  const dispatch = useDispatch()

  const history = useHistory()

  const user = useSelector(selectUser)

  const handleLogout = () => {
    dispatch(logoutUser())
    history.push('/')
  }

  return (
    <div id='nav-bar'>
      <Link to='/'>Home</Link>
      {' | '}
      <Link to='/users'>Users</Link>
      {' | '}
      {user &&
        <div className='inline-div'>
          <strong>{user.name}</strong>
          <em> logged-in.</em>
          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      }
    </div>
  )
}

export default NavigationBar