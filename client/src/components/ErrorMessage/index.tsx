import React, { ReactNode } from 'react'
import { FaExclamationCircle } from 'react-icons/fa'
import './ErrorMessage.scss'

type ErrorMessageProps = {
  center?: boolean
  full?: boolean
  children: ReactNode
}

const ErrorMessage = ({
  children,
  full = false,
  center = false,
}: ErrorMessageProps) => {
  return (
    <div className={`error-message ${full && 'full'}`}>
      <FaExclamationCircle className="error-message-icon" />
      <div className={`error-message-text ${center ? 'center' : ''}`}>
        {children}
      </div>
    </div>
  )
}

export default ErrorMessage
