import React from 'react'
import './Menu.scss'
import ThemeToggle from '@components/ThemeToggle'
import { NavLink } from 'react-router-dom'
import useAuth from '@hooks/useAuth'
import { BiHome, BiShield } from 'react-icons/bi'
import { PiChatCenteredBold, PiChatCenteredDotsBold } from 'react-icons/pi'
import { MdOutlineBusinessCenter } from 'react-icons/md'
import { VscSettingsGear } from 'react-icons/vsc'
import { SlOrganization } from 'react-icons/sl'
import { FiUsers } from 'react-icons/fi'
import Sidebar from '@components/Sidebar'

const Menu = () => {
  const { isAdmin, isSuperAdmin } = useAuth()

  return (
    <Sidebar id="menu">
      <div className="sidebar-header">Portal</div>

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
              <PiChatCenteredBold />
            </span>
            <span>Chat</span>
          </NavLink>

          {isAdmin && (
            <div className="menu-group">
              <div className="menu-group-header">
                <span>
                  <BiShield />
                </span>
                <span className="menu-group-header-text">Admin</span>
              </div>
              <div className="menu-group-items">
                <NavLink to="/admin/users">
                  <span>
                    <FiUsers />
                  </span>
                  <span>Users</span>
                </NavLink>
                <NavLink to="/admin/companies">
                  <span>
                    <MdOutlineBusinessCenter />
                  </span>
                  <span>Companies</span>
                </NavLink>
                <NavLink to="/admin/chat-channels">
                  <span>
                    <PiChatCenteredDotsBold />
                  </span>
                  <span>Chat Channels</span>
                </NavLink>
              </div>
            </div>
          )}

          {isSuperAdmin && (
            <div className="menu-group">
              <div className="menu-group-header">
                <span>
                  <BiShield />
                </span>
                <span className="menu-group-header-text">SuperAdmin</span>
              </div>
              <div className="menu-group-items">
                <NavLink to="/admin/orgs">
                  <span>
                    <SlOrganization />
                  </span>
                  <span>Orgs</span>
                </NavLink>
                <NavLink to="/admin/settings">
                  <span>
                    <VscSettingsGear />
                  </span>
                  <span>Settings</span>
                </NavLink>
              </div>
            </div>
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
