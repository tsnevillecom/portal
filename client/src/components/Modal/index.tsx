import React, { ReactNode, useContext } from 'react'
import './Modal.scss'
import { ModalContext } from '@context/ModalProvider'
import { IoMdClose } from 'react-icons/io'
import { classNames } from '@utils/classNames.util'

interface ModalProps {
  title: string
  fullscreen?: boolean
  closeable?: boolean
  children: ReactNode
}

const Modal: React.FC<ModalProps> = ({
  title,
  closeable = true,
  fullscreen = false,
  children,
}) => {
  const { hideModal } = useContext(ModalContext)

  const cx = {
    'modal-content': true,
    fullscreen,
  }

  const modalContentClasses = classNames(cx)

  return (
    <>
      <div className="modal">
        <div className={modalContentClasses}>
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
