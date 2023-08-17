import Button from '@components/Button'
import FormControl from '@components/FormControl'
import Modal from '@components/Modal'
import ModalBody from '@components/Modal/ModalBody'
import ModalFooter from '@components/Modal/ModalFooter'
import { ModalContext } from '@context/ModalProvider'
import { Errors, NewLocation, Rules } from '@types'
import { trimObjValues } from '@utils/trimObjectValues'
import { validateForm } from '@utils/validateForm.util'
import _ from 'lodash'
import React, {
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import ErrorMessage from '@components/ErrorMessage'
import useAxiosPrivate from '@hooks/useAxiosPrivate'

interface NewLocationModalProps {
  companyId: string
  onSuccess: () => void
}

const initialLocationState = {
  name: '',
  taxId: '',
  phone: '',
  address1: '',
  city: '',
  state: '',
  postalCode: '',
  active: true,
}

const NewLocationModal: React.FC<NewLocationModalProps> = ({
  companyId,
  onSuccess,
}) => {
  const axiosPrivate = useAxiosPrivate()
  const { hideModal } = useContext(ModalContext)

  const nameRef = useRef<HTMLInputElement>(null)

  const [errors, setErrors] = useState<Errors>({})
  const [location, setLocation] = useState<NewLocation>(initialLocationState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<ReactNode | string | null>(
    null
  )

  useEffect(() => {
    if (nameRef.current) nameRef.current.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = {
      ...trimObjValues(location),
      companyId,
    }

    const rules: Rules = {
      name: {
        required: true,
      },
      taxId: {
        required: true,
      },
      phone: {
        required: true,
      },
      address1: {
        required: true,
      },
      city: {
        required: true,
      },
      state: {
        required: true,
      },
      postalCode: {
        required: true,
      },
    }

    const errors = validateForm(data, rules)
    setErrors(errors)
    if (!_.isEmpty(errors)) return

    setIsSubmitting(true)

    try {
      await axiosPrivate.post('/locations', data)
      onSuccess()
      hideModal()
    } catch (error) {
      console.log(error)
      setSubmitError('Could not create new location. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (submitError) setSubmitError(null)
    if (errors[name]) setErrors(_.omit(errors, name))
    const loc = { ...location, ...{ [name]: value } }
    setLocation(loc)
  }

  return (
    <Modal title="Edit Location">
      <form onSubmit={handleSubmit}>
        <ModalBody>
          {!!submitError && <ErrorMessage>{submitError}</ErrorMessage>}

          <FormControl
            label="Name"
            forRef={nameRef}
            name="name"
            value={location.name}
            error={errors.name}
            onChange={handleInputChange}
          />

          <FormControl
            label="Tax ID"
            name="taxId"
            value={location.taxId}
            error={errors.taxId}
            onChange={handleInputChange}
          />

          <FormControl
            label="Phone"
            name="phone"
            value={location.phone}
            error={errors.phone}
            onChange={handleInputChange}
          />

          <FormControl
            label="Address 1"
            name="address1"
            value={location.address1}
            error={errors.address1}
            onChange={handleInputChange}
          />

          <FormControl
            label="Address 2"
            name="address2"
            required={false}
            value={location.address2}
            error={errors.address2}
            onChange={handleInputChange}
          />

          <FormControl
            label="City"
            name="city"
            value={location.city}
            error={errors.city}
            onChange={handleInputChange}
          />

          <FormControl
            label="State"
            name="state"
            value={location.state}
            error={errors.state}
            onChange={handleInputChange}
          />

          <FormControl
            label="Postal Code"
            name="postalCode"
            value={location.postalCode}
            error={errors.postalCode}
            onChange={handleInputChange}
          />

          <FormControl
            label="Description"
            name="description"
            textarea={true}
            required={false}
            value={location.description}
            error={errors.description}
            onChange={handleInputChange}
          />
        </ModalBody>
        <ModalFooter>
          <Button style="muted" onClick={hideModal}>
            Cancel
          </Button>
          <Button style="primary" type="submit" loading={isSubmitting}>
            Save
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}

export default NewLocationModal
