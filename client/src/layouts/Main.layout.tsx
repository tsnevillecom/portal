import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="authenticated">
        <Outlet />
      </main>
    </>
  )
}

export default MainLayout
