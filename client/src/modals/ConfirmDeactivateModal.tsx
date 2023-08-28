import Button from '@components/Button'
import Modal from '@components/Modal'
import ModalBody from '@components/Modal/ModalBody'
import ModalFooter from '@components/Modal/ModalFooter'
import { ModalContext } from '@context/ModalProvider'
import React, { useContext } from 'react'

interface ConfirmDeactivateModalProps {
  obj: { [p: string]: any }
  onConfirm: () => void
}

const ConfirmDeactivateModal: React.FC<ConfirmDeactivateModalProps> = ({
  obj,
  onConfirm,
}) => {
  const { hideModal } = useContext(ModalContext)

  const confirm = async () => {
    await onConfirm()
    hideModal()
  }

  return (
    <Modal title="Confirm Deactivate">
      <ModalBody>
        <p>
          Are you sure you want to deactivate <strong>{obj.name}</strong>?
        </p>
      </ModalBody>
      <ModalFooter>
        <Button style="secondary" onClick={hideModal}>
          Cancel
        </Button>
        <Button onClick={confirm}>Deactivate</Button>
      </ModalFooter>
    </Modal>
  )
}

export default ConfirmDeactivateModal
