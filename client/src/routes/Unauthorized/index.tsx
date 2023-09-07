import Page from '@components/Page'
import React from 'react'
import './Unauthorized.scss'
import { Link } from 'react-router-dom'

const Unauthorized = () => {
  return (
    <Page id="admin-orgs" title="Unauthorized">
      <>
        <p>You do not have access to the requested page.</p>
        <Link to="/">Home</Link>
      </>
    </Page>
  )
}

export default Unauthorized
