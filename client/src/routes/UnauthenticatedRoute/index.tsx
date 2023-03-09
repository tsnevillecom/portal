import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '@hooks/useAuth'

const UnauthenticatedRoute = () => {
  const { auth } = useAuth()

  if (auth.user && auth.isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default UnauthenticatedRoute
