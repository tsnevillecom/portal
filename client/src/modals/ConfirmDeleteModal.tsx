import Button from '@components/Button'
import Modal from '@components/Modal'
import ModalBody from '@components/Modal/ModalBody'
import ModalFooter from '@components/Modal/ModalFooter'
import React from 'react'

interface ConfirmDeleteModalProps {
  obj: { [p: string]: any }
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ obj }) => {
  return (
    <Modal title="Are you sure?">
      <ModalBody>
        <p>Are you sure you want to delete {obj.name}?</p>
      </ModalBody>
      <ModalFooter>
        <Button style="muted">Cancel</Button>
        <Button style="primary">Delete</Button>
      </ModalFooter>
    </Modal>
  )
}

export default ConfirmDeleteModal
