/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useState,
  PropsWithChildren,
  useMemo,
} from 'react'
import { ModalProps } from 'src/_types'

interface IModalContext {
  showModal: (data: ModalProps) => void
  hideModal: () => void
  modalProps: ModalProps | null
}

export const ModalContext = createContext<IModalContext>({
  hideModal: () => null,
  showModal: () => null,
  modalProps: null,
})

export const ModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [modalProps, setModalProps] = useState<ModalProps | null>(null)

  const showModal = (data: ModalProps) => {
    if (data) setModalProps(data)
  }

  const hideModal = () => {
    setModalProps(null)
  }

  const contextValue = useMemo(
    () => ({
      showModal,
      hideModal,
      modalProps,
    }),
    [modalProps]
  )

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  )
}
