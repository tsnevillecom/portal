import React, { FunctionComponent, useContext } from 'react'
import { ModalContext } from '@context/ModalProvider'
import { ModalProps } from 'src/_types'
import ConfirmDeactivateModal from './ConfirmDeactivateModal'
import EditLocationModal from './EditLocationModal'
import ConfirmReactivateModal from './ConfirmReactivateModaltsx'
import NewLocationModal from './NewLocationModal'
import EditCompanyModal from './EditCompanyModal'

const MODALS_MAP: { [name: string]: FunctionComponent } = {
  CONFIRM_DEACTIVATE: ConfirmDeactivateModal,
  CONFIRM_REACTIVATE: ConfirmReactivateModal,
  EDIT_COMPANY: EditCompanyModal,
  EDIT_LOCATION: EditLocationModal,
  NEW_LOCATION: NewLocationModal,
}

const ModalRoot = () => {
  const { modalProps } = useContext(ModalContext)
  if (!modalProps) return null
  const Modal = MODALS_MAP[(modalProps as ModalProps).name]
  return <Modal {...modalProps.data} />
}

export default ModalRoot
