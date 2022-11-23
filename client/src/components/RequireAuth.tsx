import React from 'react'
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

interface IRequireAuthProps {
  allowedRoles: string[]
}

const RequireAuth: React.FC<IRequireAuthProps> = ({ allowedRoles }) => {
  const { auth } = useAuth()
  const location = useLocation()

  //   return auth?.user?.roles?.find((role) => allowedRoles?.includes(role)) ? (
  return auth?.user ? (
    <Outlet />
  ) : auth?.accessToken ? ( //changed from user to accessToken to persist login after refresh
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  )
}

export default RequireAuth
