import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '@hooks/useAuth'
import useLogout from '@hooks/useLogout'
import './Header.scss'
import Button from '@components/Button'

const Header = () => {
  const { auth } = useAuth()
  const { logout } = useLogout()

  if (!auth.isAuthenticated) return null

  return (
    <header id="header">
      <div id="search"></div>

      <div id="header-menu">
        <Link to="/profile">
          {`${auth.user?.firstName} ${auth.user?.lastName}`}
        </Link>
        <a onClick={logout}>Sign Out</a>
      </div>
    </header>
  )
}

export default Header
