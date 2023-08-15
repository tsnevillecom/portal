import './Page.scss'
import React, { ReactNode } from 'react'
import { classNames } from '@utils/classNames.util'
import Spinner from '@components/Spinner'
import { HiOutlineShieldExclamation } from 'react-icons/hi'

interface IPage {
  isLoading?: boolean
  disabled?: boolean
  layout?: 'horizontal' | 'vertical'
  id: string
  title?: string
  children: ReactNode
}

const Page: React.FC<IPage> = ({
  isLoading,
  disabled,
  title,
  children,
  id,
  layout = 'vertical',
}) => {
  const cx = {
    page: true,
    disabled: !!disabled,
    [layout]: true,
  }
  const classes = classNames(cx)

  return (
    <section id={id} className={classes}>
      {isLoading && (
        <div id="page-loader">
          <Spinner size={60} />
        </div>
      )}

      {disabled && (
        <div id="page-disabled">
          <HiOutlineShieldExclamation size={60} />
        </div>
      )}

      {!isLoading && !disabled && (
        <>
          {!!title && <h1>{title}</h1>}
          {children}
        </>
      )}
    </section>
  )
}

export default Page
