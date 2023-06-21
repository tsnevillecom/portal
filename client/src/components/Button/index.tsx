import React, { ReactNode, MouseEvent } from 'react'
import './Button.scss'
import { CgSpinner } from 'react-icons/cg'

interface ButtonProps {
  children: string | ReactNode
  style: 'primary' | 'danger' | 'warning' | 'secondary' | 'link'
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  type?: 'submit' | 'reset' | 'button'
  disabled?: boolean
  loading?: boolean
  name?: string
  id?: string
  classes?: string
}

const defaultProps: ButtonProps = {
  children: '',
  style: 'primary',
  type: 'button',
  disabled: false,
  loading: false,
}

const Button = ({
  children,
  style,
  type,
  onClick,
  disabled,
  name,
  id,
  loading,
  classes,
}: ButtonProps) => {
  const buttonAttr = {
    type,
    name,
    id,
    className: `btn btn-${style} ${loading ? 'btn-loading' : ''} ${
      classes ? classes : ''
    }`,
    ...(onClick && {
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
