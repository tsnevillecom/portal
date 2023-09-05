import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '@hooks/useAuth'
import './Header.scss'

const Header = () => {
  const { auth } = useAuth()

  if (!auth.isAuthenticated) return null

  return (
    <header id="header">
      <div id="search"></div>

      <div id="header-menu">
        <Link to="/profile">
          {`${auth.user?.firstName} ${auth.user?.lastName}`}
        </Link>
      </div>
    </header>
  )
}

export default Header
