import React, { ReactNode, useContext } from 'react'
import './Modal.scss'
import { ModalContext } from '@context/ModalProvider'
import { IoMdClose } from 'react-icons/io'

interface ModalProps {
  title: string
  closeable?: boolean
  children: ReactNode
}

const Modal: React.FC<ModalProps> = ({ title, closeable = true, children }) => {
  const { hideModal } = useContext(ModalContext)

  return (
    <>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h1>{title}</h1>

            {closeable && (
              <div className="modal-close" onClick={hideModal}>
                <IoMdClose size={24} />
              </div>
            )}
          </div>

          {children}
        </div>

        <div className="modal-bg" />
      </div>
    </>
  )
}

export default Modal
