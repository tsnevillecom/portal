import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@components/Header'
import ThemeToggle from '@components/ThemeToggle'

const MainLayout = () => {
  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header">Portal</div>
        <div className="sidebar-user">User</div>
        <div className="sidebar-body">Body</div>
        <div className="sidebar-theme">
          <ThemeToggle />
        </div>
      </aside>
      <main className="authenticated">
        <Header />
        <Outlet />
      </main>
    </>
  )
}

export default MainLayout
