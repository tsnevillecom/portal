import React, { ReactNode } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import './SuccessMessage.scss'

type SuccessMessageProps = {
  center?: boolean
  children: ReactNode
}

const SuccessMessage = ({ children, center = true }: SuccessMessageProps) => {
  return (
    <div className="success-message">
      <FaCheckCircle className="success-message-icon" />
      <div className={`success-message-text ${center ? 'center' : ''}`}>
        {children}
      </div>
    </div>
  )
}

export default SuccessMessage
