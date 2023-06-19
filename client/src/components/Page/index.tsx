import './Page.scss'
import React, { ReactNode } from 'react'
import { classNames } from '@utils/classNames.util'
import { divide } from 'lodash'
import Spinner from '@components/Spinner'

interface IPage {
  isLoading?: boolean
  flex?: boolean
  id: string
  title?: string
  children: ReactNode
}

const Page: React.FC<IPage> = ({
  isLoading,
  title,
  children,
  id,
  flex = false,
}) => {
  const cx = {
    page: true,
    flex,
  }
  const classes = classNames(cx)

  return (
    <section id={id} className={classes}>
      {isLoading && (
        <div id="loader">
          <Spinner size={60} />
        </div>
      )}

      {!isLoading && (
        <>
          {!!title && <h1>{title}</h1>}
          {children}
        </>
      )}
    </section>
  )
}

export default Page
