import React from 'react'
import './Menu.scss'
import ThemeToggle from '@components/ThemeToggle'
import { NavLink } from 'react-router-dom'
import useAuth from '@hooks/useAuth'
import { BiChat, BiHome, BiShield } from 'react-icons/bi'
import { FaUserCircle } from 'react-icons/fa'
import { RxCaretDown } from 'react-icons/rx'

const Menu = () => {
  const { isAdmin, auth } = useAuth()

  return (
    <aside id="menu" className="sidebar">
      <div className="sidebar-header">Portal</div>
      <div className="sidebar-user">
        <span className="sidebar-user-avatar">
          <FaUserCircle />
        </span>
        <span className="sidebar-user-name">
          {auth.user?.firstName} {auth.user?.lastName}
        </span>
        <span className="sidebar-user-caret">
          <RxCaretDown size={24} />
        </span>
      </div>
      <div className="sidebar-body">
        <nav>
          <NavLink to="/">
            <span>
              <BiHome />
            </span>
            <span>Home</span>
          </NavLink>
          <NavLink to="/chat">
            <span>
              <BiChat />
            </span>
            <span>Chat</span>
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin">
              <span>
                <BiShield />
              </span>
              <span>Admin</span>
            </NavLink>
          )}
        </nav>
      </div>
      <div className="sidebar-theme">
        <ThemeToggle />
      </div>
    </aside>
  )
}

export default Menu
