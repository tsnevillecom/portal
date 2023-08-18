import Button from '@components/Button'
import Modal from '@components/Modal'
import ModalBody from '@components/Modal/ModalBody'
import ModalFooter from '@components/Modal/ModalFooter'
import { ModalContext } from '@context/ModalProvider'
import React, { useContext } from 'react'

interface ConfirmReactivateModalProps {
  obj: { [p: string]: any }
  onConfirm: () => void
}

const ConfirmReactivateModal: React.FC<ConfirmReactivateModalProps> = ({
  obj,
  onConfirm,
}) => {
  const { hideModal } = useContext(ModalContext)

  const confirm = async () => {
    await onConfirm()
    hideModal()
  }

  return (
    <Modal title="Confirm Reactivate">
      <ModalBody>
        <p>
          Are you sure you want to reactivate <strong>{obj.name}</strong>?
        </p>
      </ModalBody>
      <ModalFooter>
        <Button style="muted" onClick={hideModal}>
          Cancel
        </Button>
        <Button onClick={confirm}>Reactivate</Button>
      </ModalFooter>
    </Modal>
  )
}

export default ConfirmReactivateModal
