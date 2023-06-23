import { classNames } from '@utils/classNames.util'
import _ from 'lodash'
import './Tabs.scss'
import React, {
  PropsWithChildren,
  Children,
  isValidElement,
  cloneElement,
  useState,
  useEffect,
  useRef,
} from 'react'

interface iTabs {
  id?: string
  layout?: 'horizontal' | 'vertical'
  activeIndex?: number
}

interface iTab {
  name: string
  onActivate?: () => void
}

interface InjectedProps {
  className?: string
}

interface ISlider {
  top: string
  left: string
  width: string
}

type MergedProps = iTab & InjectedProps

const Tabs = ({
  id,
  layout = 'horizontal',
  activeIndex = 0,
  children,
}: PropsWithChildren<iTabs>) => {
  const arrayChildren = Children.toArray(children)
  const [activeTab, setActiveTab] = useState(activeIndex)
  const [sliderPosition, setSliderPosition] = useState<ISlider>({
    top: '0px',
    left: '800px',
    width: '0px',
  })
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const activeChild = arrayChildren[activeTab]
    if (isValidElement<iTab>(activeChild)) {
      if (activeChild.props.onActivate) activeChild.props.onActivate()

      if (tabsRef.current) {
        const tabsParent = tabsRef.current
        const activeTabItem = tabsParent.querySelector(
          '.tab-list-item.active'
        ) as HTMLLIElement

        setSliderPosition({
          top: activeTabItem.offsetHeight + 'px',
          left: activeTabItem.offsetLeft + 'px',
          width: activeTabItem.offsetWidth + 'px',
        })
      }
    }
  }, [activeTab])

  const cx = {
    tabs: true,
    [layout]: true,
  }
  const tabsClasses = classNames(cx)

  return (
    <div {...(id && { id })} className={tabsClasses} ref={tabsRef}>
      <ul className="tabs-list">
        {_.map(arrayChildren, (child, index) => {
          if (isValidElement<iTab>(child)) {
            const cx = {
              ['tab-list-item']: true,
              active: activeTab === index,
            }
            const tabListItemClasses = classNames(cx)

            return (
              <li
                className={tabListItemClasses}
                onClick={() => setActiveTab(index)}
                key={`tab-item_${index}`}
              >
                {child.props.name}
              </li>
            )
          }
          return null
        })}
      </ul>

      <div className="tab-slider" style={sliderPosition} />

      {_.map(arrayChildren, (child, index) => {
        if (isValidElement<iTab>(child)) {
          const cx = {
            tab: true,
            active: activeTab === index,
          }
          const tabClasses = classNames(cx)

          return cloneElement<MergedProps>(child, {
            className: tabClasses,
            key: `tab_${index}`,
          })
        }
        return null
      })}
    </div>
  )
}

export default Tabs

export const Tab = ({
  className,
  children,
}: PropsWithChildren<MergedProps>) => {
  return <div className={className}>{children}</div>
}
