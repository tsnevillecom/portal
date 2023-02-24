import React, {
  createContext,
  useState,
  useRef,
  PropsWithChildren,
} from 'react'

import { generateUuid } from '../_utils/generateUuid.util'
import { Toast, ToastType } from '../_types/toast'

interface ToastContextData {
  toasts: Toast[]
  removeToast: (id: string) => void
  addToast: (
    message: string,
    type?: ToastType,
    dismissable?: boolean,
    time?: number,
    title?: string | null
  ) => void
}

const toastContextDefaultValue: ToastContextData = {
  toasts: [],
  removeToast: () => null,
  addToast: () => null,
}

const useToastContextValue = (): ToastContextData => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastRef = useRef(toasts)
  toastRef.current = toasts

  const addToast = (
    message: string,
    type: ToastType = 'danger',
    dismissable = true,
    time = 0,
    title = null
  ) => {
    const id = generateUuid()
    const newToast = { id, type, message, dismissable, time, title }
    const toastArr = [...toasts, newToast]
    setToasts(toastArr)

    if (time > 0) {
      setTimeout(() => {
        removeToast(id)
      }, time)
    }
  }

  const removeToast = (id: string) => {
    const toastArr = toastRef.current.filter((toast) => {
      return toast.id !== id
    })

    setToasts(toastArr)
  }

  return {
    toasts,
    removeToast,
    addToast,
  }
}

export const ToastContext = createContext<ToastContextData>(
  toastContextDefaultValue
)

export const ToastProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ToastContext.Provider value={useToastContextValue()}>
      {children}
    </ToastContext.Provider>
  )
}
