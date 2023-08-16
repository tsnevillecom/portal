import React, { FunctionComponent, useContext } from 'react'
import { ModalContext } from '@context/ModalProvider'
import { ModalProps } from 'src/_types'

const Test: React.FC = (modalData) => {
  console.log(modalData)

  return <div style={{ color: 'yellow' }}>Test</div>
}

const MODALS_MAP: { [name: string]: FunctionComponent } = {
  TEST_MODAL: Test,
}

const ModalRoot = () => {
  const { modalProps } = useContext(ModalContext)
  if (!modalProps) return null
  const Modal = MODALS_MAP[(modalProps as ModalProps).name]
  return <Modal {...modalProps.data} />
}

export default ModalRoot
