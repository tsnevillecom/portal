import React, { useContext } from 'react'
import './Toasts.scss'
import Toast from './Toast'
import { ToastContext } from 'src/context/ToastContext'

const Toasts: React.FC = () => {
  const { toasts } = useContext(ToastContext)

  return (
    <div id="toasts">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

export default Toasts
