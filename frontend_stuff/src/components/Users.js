import { chain } from 'lodash'

import React from 'react'
import { useSelector } from 'react-redux'
import {
  Link, Route, Switch, useRouteMatch
} from 'react-router-dom'

import { selectRawBlogs, selectUsers } from '../features/blog/blogSlice'
import User from './User'

const Users = () => {

  const { path, url } = useRouteMatch()

  const blogs = useSelector(selectRawBlogs)

  const users = useSelector(state => selectUsers(state))

  const userTable = () => (<table>
    <thead>
      <tr>
        <td><strong>Users</strong></td>
        <td><strong>Blogs Created</strong></td>
      </tr>
    </thead>
    <tbody>
      {
        chain(blogs)
          .countBy('user.id')
          .toPairs()
          .value()
          .map(pair =>
            <tr key={pair[0]}>
              <td>
                <Link to={`${url}/${users[pair[0]].id}`}>
                  {users[pair[0]].name}
                </Link>
              </td>
              <td>{pair[1]}</td>
            </tr>
          )
      }
    </tbody>
  </table>)

  return (
    <>
      <Route exact path={path}>
        {userTable()}
      </Route>
      <Route exact path={`${path}/:userId`} >
        <User />
      </Route>
    </>
  )
}

export default Users