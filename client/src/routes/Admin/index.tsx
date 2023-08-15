import Page from '@components/Page'
import './Admin.scss'
import Tabs, { Tab } from '@components/Tabs'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import { User } from '@types'
import _ from 'lodash'
import React, { useState } from 'react'
import { Company } from 'src/_types/company'

const Admin = () => {
  const axiosPrivate = useAxiosPrivate()
  const [users, setUers] = useState<User[]>([])
  const [companies, setCompanies] = useState<Company[]>([])

  const getUsers = async () => {
    try {
      const response = await axiosPrivate('/users')
      setUers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getCompanies = async () => {
    try {
      const response = await axiosPrivate('/company')
      setCompanies(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Page id="admin-route" title="Admin">
      <Tabs>
        <Tab name="Users" onActivate={() => getUsers()} id="users">
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
                  <tr key={user._id} className="row">
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
        </Tab>
        <Tab name="Chat" onActivate={() => console.log('load chat')}>
          Chat dashboard
        </Tab>
        <Tab name="Companies" onActivate={() => getCompanies()} id="companies">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Account Id</th>
                <th>Is deleted?</th>
              </tr>
            </thead>
            <tbody>
              {_.map(companies, (company) => {
                return (
                  <tr key={company._id} className="row">
                    <td>{company.name}</td>
                    <td>{company.accountId}</td>
                    <td>{company.deleted.toString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Tab>
      </Tabs>
    </Page>
  )
}

export default Admin
