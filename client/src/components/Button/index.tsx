import React, { ReactNode, MouseEvent } from 'react'
import './Button.scss'
import { CgSpinner } from 'react-icons/cg'
import { classNames } from '@utils/classNames.util'

interface ButtonProps {
  children: string | ReactNode
  style:
    | 'primary'
    | 'danger'
    | 'warning'
    | 'secondary'
    | 'link'
    | 'muted'
    | 'success'
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  type?: 'submit' | 'reset' | 'button'
  disabled?: boolean
  loading?: boolean
  name?: string
  id?: string
  classes?: string
  size?: 'sm' | 'md' | 'lg'
}

const defaultProps: ButtonProps = {
  children: '',
  style: 'primary',
  type: 'button',
  size: 'md',
  disabled: false,
  loading: false,
}

const Button = ({
  children,
  style,
  size,
  type,
  onClick,
  disabled,
  name,
  id,
  loading,
  classes,
}: ButtonProps) => {
  const cx = {
    btn: true,
    [`btn-${style}`]: true,
    [`btn-${size}`]: true,
    'btn-loading': loading,
    [`${classes}`]: !!classes,
  }

  const buttonClasses = classNames(cx)

  const buttonAttr = {
    type,
    name,
    id,
    className: buttonClasses,
    ...(loading && {
      onClick: (e: MouseEvent<HTMLButtonElement>) => e.preventDefault(),
    }),
    ...(!loading &&
      onClick && {
        onClick: (e: MouseEvent<HTMLButtonElement>) => onClick(e),
      }),
    ...(disabled && { disabled }),
  }

  return (
    <button {...buttonAttr}>
      {loading && <CgSpinner className="loading" size={22} />}
      <span>{children}</span>
    </button>
  )
}

Button.defaultProps = defaultProps

export default Button
