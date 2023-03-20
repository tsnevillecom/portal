import React, { PropsWithChildren } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import './SuccessMessage.scss'

const SuccessMessage = ({ children }: PropsWithChildren) => {
  return (
    <div className="success-message">
      <FaCheckCircle className="success-message-icon" size={32} />
      <div className="success-message-text">
        <div>{children}</div>
      </div>
    </div>
  )
}

export default SuccessMessage
