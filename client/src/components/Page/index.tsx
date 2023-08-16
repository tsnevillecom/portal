import './Page.scss'
import React, { ReactNode } from 'react'
import { classNames } from '@utils/classNames.util'
import { Link } from 'react-router-dom'
import { BiSolidLeftArrowCircle } from 'react-icons/bi'
import Spinner from '@components/Spinner'
import { HiOutlineShieldExclamation } from 'react-icons/hi'

interface IPage {
  isLoading?: boolean
  disabled?: boolean
  layout?: 'horizontal' | 'vertical'
  id: string
  title?: string
  back?: boolean
  children: ReactNode
}

const Page: React.FC<IPage> = ({
  isLoading,
  disabled,
  title,
  children,
  id,
  back = false,
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
          {(back || !!title) && (
            <div className="page-header">
              {back && (
                <Link to={-1 as any}>
                  <BiSolidLeftArrowCircle size={30} />
                </Link>
              )}
              {!!title && <h1>{title}</h1>}
            </div>
          )}
          {children}
        </>
      )}
    </section>
  )
}

export default Page
