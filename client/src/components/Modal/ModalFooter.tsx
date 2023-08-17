import React, { ReactNode } from 'react'

interface ModalFooterProps {
  children: ReactNode
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children }) => {
  return <div className="modal-footer">{children}</div>
}

export default ModalFooter
