import Page from '@components/Page'
import Tabs, { Tab } from '@components/Tabs'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import { User } from '@types'
import _ from 'lodash'
import React, { useState } from 'react'

const Admin = () => {
  const axiosPrivate = useAxiosPrivate()
  const [users, setUers] = useState<User[]>([])

  const getUsers = async () => {
    try {
      const response = await axiosPrivate('/users')
      setUers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Page id="admin-route" title="Admin">
      <Tabs>
        <Tab name="Users" onActivate={() => getUsers()}>
          {_.map(users, (user) => {
            return (
              <div key={user._id}>
                <div>{user._id}</div>
                <div>{user.firstName}</div>
                <div>{user.lastName}</div>
                <div>{user.email}</div>
                <div>{user.role}</div>
                <div>{user.active}</div>
              </div>
            )
          })}
        </Tab>
        <Tab name="Chat" onActivate={() => console.log('load chat')}>
          Chat dashboard
        </Tab>
        <Tab name="Companies" onActivate={() => console.log('load companies')}>
          Companies dashboard
        </Tab>
      </Tabs>
    </Page>
  )
}

export default Admin
