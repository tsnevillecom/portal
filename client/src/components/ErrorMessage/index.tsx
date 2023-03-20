import React, { PropsWithChildren } from 'react'
import { MdError } from 'react-icons/md'
import './ErrorMessage.scss'

const ErrorMessage = ({ children }: PropsWithChildren) => {
  return (
    <div className="error-message">
      <MdError className="error-message-icon" size={32} />
      <div className="error-message-text">
        <div>{children}</div>
      </div>
    </div>
  )
}

export default ErrorMessage
