import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@components/Header'
import Menu from '@components/Menu'

const MainLayout = () => {
  return (
    <>
      <Menu />
      <main className="authenticated">
        <Header />
        <Outlet />
      </main>
    </>
  )
}

export default MainLayout
