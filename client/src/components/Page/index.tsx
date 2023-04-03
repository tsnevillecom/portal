import './Page.scss'
import _ from 'lodash'
import React, { ReactNode, useEffect, useState } from 'react'
import { classNames } from '@utils/classNames.util'

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
  if (isLoading) return null

  const cx = {
    page: true,
    flex,
  }
  const classes = classNames(cx)

  return (
    <section id={id} className={classes}>
      {!!title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

export default Page
