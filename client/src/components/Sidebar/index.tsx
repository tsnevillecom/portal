import React, { useState, PropsWithChildren, useEffect } from 'react'
import './Sidebar.scss'
import { classNames } from '@utils/classNames.util'

interface ISidebar {
  id?: string
  side?: 'right' | 'left'
  open?: boolean
  width?: number
}

const Sidebar = ({
  id,
  side = 'left',
  open = true,
  width = 240,
  children,
}: PropsWithChildren<ISidebar>) => {
  const [isOpen, setIsOpen] = useState(open)

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  const cx = {
    sidebar: true,
    open: isOpen,
    [`sidebar-${side}`]: true,
  }

  const sidebarClasses = classNames(cx)

  const styles = {
    ...(!isOpen && side === 'left' && { marginLeft: -width + 'px' }),
    ...(!isOpen && side === 'right' && { marginRight: -width + 'px' }),
    ...(width && { width: width + 'px' }),
  }
  return (
    <aside {...(id && { id })} className={sidebarClasses} style={styles}>
      {children}
    </aside>
  )
}

export default Sidebar
