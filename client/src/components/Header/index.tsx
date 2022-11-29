import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from 'src/hooks/useAuth'
import useLogout from 'src/hooks/useLogout'
import './Header.scss'

const Header = () => {
  const { auth } = useAuth()
  const logout = useLogout()

  if (!auth.isAuthenticated) return null

  return (
    <div id="header">
      <div id="logo">Logo</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/admin">Admin</Link>
      </nav>
      <div id="user-menu">
        <Link to="/profile">
          {`${auth.user?.firstName} ${auth.user?.lastName}`}
        </Link>
      </div>

      <button onClick={logout}>Sign Out</button>
    </div>
  )
}

export default Header
