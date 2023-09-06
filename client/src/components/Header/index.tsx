import React from 'react'
import useAuth from '@hooks/useAuth'
import './Header.scss'
import UserMenu from '@components/UserMenu'

const Header = () => {
  const { auth } = useAuth()

  if (!auth.isAuthenticated) return null

  return (
    <header id="header">
      <div id="search"></div>

      <UserMenu />
    </header>
  )
}

export default Header
