import React, { useContext } from 'react'
import './Toasts.scss'
import { classNames } from '../../_utils/classNames.util'
import { IToast } from '../../_types/toast'
import { ToastContext } from 'src/context/ToastContext'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { BiErrorCircle } from 'react-icons/bi'

interface ToastProps {
  toast: IToast
  dismiss?: () => void
}

const Toast: React.FC<ToastProps> = ({ toast, dismiss }) => {
  const { removeToast } = useContext(ToastContext)

  const titles = {
    danger: 'Error',
    warning: 'Warning',
    success: '',
    info: 'Info',
  }

  const title = toast.title !== null ? toast.title : titles[toast.type]
  const icon =
    toast.type === 'success' ? (
      <AiOutlineCheckCircle className="toast-success-icon" />
    ) : (
      <BiErrorCircle className="toast-error-icon" />
    )

  const cx = {
    toast: true,
    [`toast-${toast.type}`]: true,
  }

  const toastClasses = classNames(cx)

  const closeToast = () => {
    if (dismiss) {
      dismiss()
    } else {
      removeToast(toast.id)
    }
  }

  return (
    <div className={toastClasses} data-toast-id={toast.id}>
      <div className="toast--details--icon">{icon}</div>
      <div className="toast--details">
        {title && <span className="toast--details--title">{title}:</span>}
        <span className="toast--details--message">{toast.message}</span>
      </div>
      {toast.dismissable && (
        <div className="toast--close" onClick={closeToast}>
          X
        </div>
      )}
    </div>
  )
}

export default Toast
