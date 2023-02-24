import React from 'react'
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

interface IAuthenticatedRouteProps {
  allowedRoles: string[]
}

const AuthenticatedRoute: React.FC<IAuthenticatedRouteProps> = ({
  allowedRoles,
}) => {
  const { auth } = useAuth()
  const location = useLocation()

  return auth.user &&
    (!allowedRoles.length || allowedRoles.includes(auth.user.role)) ? (
    <Outlet />
  ) : auth.accessToken ? ( //changed from user to accessToken to persist login after refresh
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" replace />
  )
}

export default AuthenticatedRoute
