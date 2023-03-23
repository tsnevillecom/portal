import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '@hooks/useAuth'
import useLogout from '@hooks/useLogout'
import './Header.scss'
import Button from '@components/Button'

const Header = () => {
  const { auth, isAdmin } = useAuth()
  const { logout } = useLogout()

  if (!auth.isAuthenticated) return null

  return (
    <header>
      <div id="logo">LOGO</div>
      <nav>
        <Link to="/">Home</Link>
        {isAdmin && <Link to="/admin">Admin</Link>}
      </nav>
      <div id="user-menu">
        <Link to="/profile">
          {`${auth.user?.firstName} ${auth.user?.lastName}`}
        </Link>
      </div>

      <Button style="link" onClick={logout}>
        Sign Out
      </Button>
    </header>
  )
}

export default Header
