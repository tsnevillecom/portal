import Page from '@components/Page'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import { User } from '@types'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'

const AdminUsers = () => {
  const axiosPrivate = useAxiosPrivate()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = async () => {
    try {
      const response = await axiosPrivate('/users')
      setUsers(response.data)
    } catch (error) {
      console.log(error)
    }

    setIsLoading(false)
  }

  return (
    <Page id="admin-users" title="Users" isLoading={isLoading}>
      <table>
        <thead>
          <tr>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Is active?</th>
          </tr>
        </thead>
        <tbody>
          {_.map(users, (user) => {
            return (
              <tr key={user._id}>
                <td>{user.lastName}</td>
                <td>{user.firstName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.active.toString()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Page>
  )
}

export default AdminUsers
