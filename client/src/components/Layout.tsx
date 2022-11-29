import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'

const Layout = () => {
  return (
    <main id="app">
      <Header />
      <div id="app-body">
        <Outlet />
      </div>
    </main>
  )
}

export default Layout
