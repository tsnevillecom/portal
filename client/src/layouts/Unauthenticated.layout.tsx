import Identity from '@components/Identity'
import React from 'react'
import { Outlet } from 'react-router-dom'

const UnauthenticatedLayout = () => {
  return (
    <main className="unauthenticated">
      <Outlet />
    </main>
  )
}

export default UnauthenticatedLayout
