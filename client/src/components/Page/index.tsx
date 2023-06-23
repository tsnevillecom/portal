import './Page.scss'
import React, { ReactNode } from 'react'
import { classNames } from '@utils/classNames.util'
import Spinner from '@components/Spinner'

interface IPage {
  isLoading?: boolean
  layout?: 'horizontal' | 'vertical'
  id: string
  title?: string
  children: ReactNode
}

const Page: React.FC<IPage> = ({
  isLoading,
  title,
  children,
  id,
  layout = 'vertical',
}) => {
  const cx = {
    page: true,
    [layout]: true,
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
