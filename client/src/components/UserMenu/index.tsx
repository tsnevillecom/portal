import React, { useRef } from 'react'
import './UserMenu.scss'
import { NavLink } from 'react-router-dom'
import { useResponsive } from '@farfetch/react-context-responsive'
import { RxCaretDown } from 'react-icons/rx'
import useAuth from '@hooks/useAuth'
import { classNames } from '@utils/classNames.util'
import { useDetectOutsideClick } from '@hooks/useDetectOutsideClick'
import { FaUserCircle } from 'react-icons/fa'
import useLogout from '@hooks/useLogout'

const UserMenu: React.FC = () => {
  const { lessThan } = useResponsive()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false)
  const { logout } = useLogout()
  const { auth } = useAuth()

  const triggerCx = {
    'menu-trigger': true,
    open: isActive,
  }

  const menuCx = {
    menu: true,
    active: isActive,
    inactive: !isActive,
  }

  const userMenuTriggerClasses = classNames(triggerCx)
  const userMenuClasses = classNames(menuCx)

  return (
    <div id="user-menu">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsActive(!isActive)
        }}
        className={userMenuTriggerClasses}
      >
        {lessThan.sm && <RxCaretDown size={24} />}
        <FaUserCircle />
        {!lessThan.sm && (
          <>
            <span>
              {auth.user?.firstName} {auth.user?.lastName}
            </span>
            <RxCaretDown size={24} />
          </>
        )}
      </button>
      <div ref={dropdownRef} className={userMenuClasses}>
        <ul>
          <li>
            <NavLink to="/profile" onClick={() => setIsActive(false)}>
              Profile
            </NavLink>
          </li>

          <li className="separator" />
          <li>
            <a onClick={logout}>Sign Out</a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default UserMenu
