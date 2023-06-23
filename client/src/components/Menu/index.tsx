import React, { useState } from 'react'
import './Menu.scss'
import ThemeToggle from '@components/ThemeToggle'
import { NavLink } from 'react-router-dom'
import useAuth from '@hooks/useAuth'
import { BiChat, BiHome, BiShield } from 'react-icons/bi'
import { FaUserCircle } from 'react-icons/fa'
import { RxCaretDown } from 'react-icons/rx'
import Sidebar from '@components/Sidebar'

const Menu = () => {
  const { isAdmin, isSuperAdmin, auth } = useAuth()
  const [open, setOpen] = useState(true)

  return (
    <Sidebar id="menu">
      <div className="sidebar-header">Portal</div>
      <div
        className={`sidebar-user ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
      >
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
      <div className="sidebar-user-menu">
        <div className="sidebar-user-menu-items">
          <div>Test</div>
          <div>Test</div>
          <div>Test</div>
          <div>Test</div>
          <div>Test</div>
          <div>Test</div>
        </div>
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
          {isSuperAdmin && (
            <NavLink to="/admin">
              <span>
                <BiShield />
              </span>
              <span>Super Admin</span>
            </NavLink>
          )}
        </nav>
      </div>
      <div className="sidebar-theme">
        <ThemeToggle />
      </div>
    </Sidebar>
  )
}

export default Menu
