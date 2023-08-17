import React, { FunctionComponent, useContext } from 'react'
import { ModalContext } from '@context/ModalProvider'
import { ModalProps } from 'src/_types'
import ConfirmationModal from './ConfirmDeleteModal'

const MODALS_MAP: { [name: string]: FunctionComponent } = {
  CONFIRMATION: ConfirmationModal,
}

const ModalRoot = () => {
  const { modalProps } = useContext(ModalContext)
  if (!modalProps) return null
  const Modal = MODALS_MAP[(modalProps as ModalProps).name]
  return <Modal {...modalProps.data} />
}

export default ModalRoot
