import React, { useState } from 'react'
import './Menu.scss'
import ThemeToggle from '@components/ThemeToggle'
import { Link, NavLink } from 'react-router-dom'
import useAuth from '@hooks/useAuth'
import { BiChat, BiHome, BiShield } from 'react-icons/bi'
import { FaUserCircle } from 'react-icons/fa'
import { RxCaretDown } from 'react-icons/rx'
import Sidebar from '@components/Sidebar'
import CONSTANTS from '@constants/index'
import useLogout from '@hooks/useLogout'

const Menu = () => {
  const { isAdmin, auth } = useAuth()
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const [openAdmin, setOpenAdmin] = useState(true)
  const { logout } = useLogout()

  if (!auth.user) return null

  return (
    <Sidebar id="menu">
      <div className="sidebar-header">Portal</div>
      <div
        className={`sidebar-user ${openUserMenu ? 'open' : ''}`}
        onClick={() => setOpenUserMenu(!openUserMenu)}
      >
        <span className="sidebar-user-avatar">
          <FaUserCircle />
        </span>
        <span className="sidebar-user-name">
          {auth.user?.firstName} {auth.user?.lastName}
        </span>
        <span className="caret">
          <RxCaretDown size={24} />
        </span>
      </div>
      <div className="sidebar-user-menu">
        <div className="sidebar-user-menu-items">
          <div className="submenu-items">
            <NavLink to="/profile">Profile</NavLink>
            <a onClick={logout}>Sign Out</a>
          </div>
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
            <div id="admin-menu" className={openAdmin ? 'open' : ''}>
              <div
                id="admin-menu-trigger"
                onClick={() => setOpenAdmin(!openAdmin)}
              >
                <span>
                  <BiShield />
                </span>
                <span id="admin-menu-trigger-text">Admin</span>
                <span className="caret">
                  <RxCaretDown size={24} />
                </span>
              </div>
              <div className="submenu-items">
                <NavLink to="/admin/users">
                  <span>•</span>
                  <span>Users</span>
                </NavLink>
                <NavLink to="/admin/companies">
                  <span>•</span>
                  <span>Companies</span>
                </NavLink>
                <NavLink to="/admin/chat-channels">
                  <span>•</span>
                  <span>Chat</span>
                </NavLink>
              </div>
            </div>
          )}
        </nav>
      </div>

      <div className="sidebar-theme">
        <ThemeToggle />
      </div>
      <div className="sidebar-user-id">{auth.user._id}</div>
    </Sidebar>
  )
}

export default Menu
