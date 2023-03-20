import React from 'react'
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import useAuth from '@hooks/useAuth'

interface IAuthenticatedRouteProps {
  allowedRoles: string[]
}

const AuthenticatedRoute: React.FC<IAuthenticatedRouteProps> = ({
  allowedRoles,
}) => {
  const { auth } = useAuth()
  const location = useLocation()

  if (auth.user) {
    if (!auth.user.isVerified) {
      return <Navigate to="/verify" state={{ from: location }} replace />
    } else if (!allowedRoles.length || allowedRoles.includes(auth.user.role)) {
      return <Outlet />
    } else {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />
    }
  } else {
    return <Navigate to="/login" replace />
  }

  // return auth.user &&
  //   (!allowedRoles.length || allowedRoles.includes(auth.user.role)) ? (
  //   <Outlet />
  // ) : auth.accessToken ? (
  //   <Navigate to="/unauthorized" state={{ from: location }} replace />
  // ) : (
  //   <Navigate to="/login" replace />
  // )
}

export default AuthenticatedRoute
