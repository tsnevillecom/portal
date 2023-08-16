import Page from '@components/Page'
import './Admin.scss'
import _ from 'lodash'
import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import NavTabs from '@components/NavTabs'

const Admin = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === '/admin') {
      navigate('/admin/users', { replace: true })
    }
  })

  return (
    <Page id="admin-route" title="Admin" scrollable={false}>
      <NavTabs
        links={[
          { name: 'Users', to: 'users' },
          { name: 'Companies', to: 'companies' },
          { name: 'Chat Channels', to: 'chat-channels' },
        ]}
      />
      <Outlet />
    </Page>
  )
}

export default Admin
