import React, {
  createContext,
  useState,
  useRef,
  PropsWithChildren,
  useMemo,
} from 'react'

import { generateUuid } from '@utils/generateUuid.util'
import { IToast, IToastType } from '@types'

interface IToastContext {
  toasts: IToast[]
  removeToast: (id: string) => void
  addToast: (
    message: string,
    type?: IToastType,
    dismissable?: boolean,
    time?: number,
    title?: string | null
  ) => void
}

export const ToastContext = createContext<IToastContext>({
  toasts: [],
  removeToast: () => null,
  addToast: () => null,
})

export const ToastProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<IToast[]>([])
  const toastRef = useRef(toasts)
  toastRef.current = toasts

  const addToast = (
    message: string,
    type: IToastType = 'danger',
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

  const contextValue = useMemo(
    () => ({
      toasts,
      removeToast,
      addToast,
    }),
    [toasts]
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  )
}
