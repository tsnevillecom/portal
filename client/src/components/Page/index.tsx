import './Page.scss'
import React, { ReactElement, ReactNode } from 'react'
import { classNames } from '@utils/classNames.util'
import { Link } from 'react-router-dom'
import { BiSolidLeftArrowCircle } from 'react-icons/bi'
import Spinner from '@components/Spinner'
import { HiOutlineShieldExclamation } from 'react-icons/hi'

interface IPage {
  isLoading?: boolean
  disabled?: boolean
  scrollable?: boolean
  layout?: 'horizontal' | 'vertical'
  actions?: ReactElement[] | ReactElement
  id: string
  title?: string
  children: ReactNode
}

const Page: React.FC<IPage> = ({
  isLoading,
  disabled,
  actions,
  title,
  children,
  id,
  scrollable = true,
  layout = 'vertical',
}) => {
  const cx = {
    page: true,
    disabled: !!disabled,
    scrollable: scrollable,
    [layout]: true,
  }
  const classes = classNames(cx)

  return (
    <section id={id} className={classes}>
      {isLoading && (
        <div className="page-loader">
          <Spinner size={60} />
        </div>
      )}

      {disabled && (
        <div className="page-disabled">
          <HiOutlineShieldExclamation size={60} />
        </div>
      )}

      {!isLoading && !disabled && (
        <>
          {!!title && (
            <div className="page-header">
              {!!title && <h1>{title}</h1>}
              {actions && <div className="actions">{actions}</div>}
            </div>
          )}
          {children}
        </>
      )}
    </section>
  )
}

export default Page
