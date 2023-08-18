import { classNames } from '@utils/classNames.util'
import _ from 'lodash'
import './NavTabs.scss'
import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

interface iTabs {
  id?: string
  layout?: 'horizontal' | 'vertical'
  links: {
    name: string
    to: string
  }[]
}

interface ISlider {
  top: string
  left: string
  width: string
}

const NavTabs = ({ id, layout = 'horizontal', links }: iTabs) => {
  const location = useLocation()
  const [sliderPosition, setSliderPosition] = useState<ISlider>({
    top: '0px',
    left: '800px',
    width: '0px',
  })
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (tabsRef.current) {
      const tabsParent = tabsRef.current
      const activeTabItem = tabsParent.querySelector(
        '.nav-tab-list-item.active'
      ) as HTMLLIElement
      if (activeTabItem)
        setSliderPosition({
          top: activeTabItem.offsetHeight + 'px',
          left: activeTabItem.offsetLeft + 'px',
          width: activeTabItem.offsetWidth + 'px',
        })
    }
  }, [location])

  const cx = {
    'nav-tabs': true,
    [layout]: true,
  }
  const tabsClasses = classNames(cx)

  return (
    <div {...(id && { id })} className={tabsClasses} ref={tabsRef}>
      <div className="nav-tabs-list">
        {_.map(links, (link, index) => {
          return (
            <NavLink
              to={link.to}
              key={index}
              className={({ isActive, isPending }) =>
                isPending
                  ? 'nav-tab-list-item pending'
                  : isActive
                  ? 'nav-tab-list-item active'
                  : 'nav-tab-list-item'
              }
            >
              {link.name}
            </NavLink>
          )
        })}
      </div>

      <div className="nav-tab-slider" style={sliderPosition} />
    </div>
  )
}

export default NavTabs

{
  /*
 
// Example

<NavTabs
  links={[
    { name: 'Users', to: 'users' },
    { name: 'Companies', to: 'companies' },
    { name: 'Chat Channels', to: 'chat-channels' },
  ]}
/> 

*/
}
