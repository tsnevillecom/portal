import Button from '@components/Button'
import FormControl from '@components/FormControl'
import Modal from '@components/Modal'
import ModalBody from '@components/Modal/ModalBody'
import ModalFooter from '@components/Modal/ModalFooter'
import { ModalContext } from '@context/ModalProvider'
import { Errors, NewLocation, Rules } from '@types'
import { trimObjValues } from '@utils/trimObjectValues'
import { validateForm } from '@utils/validateForm.util'
import Select from 'react-select'
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
import CONSTANTS from '@constants/index'

interface NewLocationModalProps {
  companyId: string
  onSuccess: () => void
}

type StateOption = {
  value: string
  label: string
}

const statesOption: StateOption[] = Object.entries(CONSTANTS.STATES).map(
  ([k, v]) => {
    return {
      value: k,
      label: v,
    }
  }
)

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
    console.log(CONSTANTS.STATES)
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
    const updatedLocation = { ...location, ...{ [name]: value } }
    setLocation(updatedLocation)
  }

  const handleOnSelect = (name: string, option: StateOption) => {
    const { value } = option
    if (submitError) setSubmitError(null)
    if (errors[name]) setErrors(_.omit(errors, name))
    const updatedLocation = { ...location, ...{ [name]: value } }
    setLocation(updatedLocation)
  }

  return (
    <Modal title="New Location" fullscreen>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          {!!submitError && <ErrorMessage>{submitError}</ErrorMessage>}
          <div className="grid">
            <div className="col col-6 col-md">
              <FormControl
                label="Name"
                forRef={nameRef}
                name="name"
                value={location.name}
                error={errors.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="col col-6 col-md">
              <FormControl
                label="Tax ID"
                name="taxId"
                value={location.taxId}
                error={errors.taxId}
                onChange={handleInputChange}
              />
            </div>
            <div className="col col-6 col-md">
              <FormControl
                label="Phone"
                name="phone"
                value={location.phone}
                error={errors.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="col col-6 col-md">
              <FormControl
                label="Address 1"
                name="address1"
                value={location.address1}
                error={errors.address1}
                onChange={handleInputChange}
              />
            </div>
            <div className="col col-6 col-md">
              <FormControl
                label="Address 2"
                name="address2"
                required={false}
                value={location.address2}
                error={errors.address2}
                onChange={handleInputChange}
              />
            </div>
            <div className="col col-6 col-md">
              <FormControl
                label="City"
                name="city"
                value={location.city}
                error={errors.city}
                onChange={handleInputChange}
              />
            </div>
            <div className="col col-6 col-md">
              <div className="form-control">
                <label className="label-default-semibold">
                  Company Type<span>*</span>
                </label>
                <Select
                  defaultValue={_.find(
                    statesOption,
                    (option) => location.state === option.value
                  )}
                  onChange={(option) =>
                    handleOnSelect('state', option as StateOption)
                  }
                  options={statesOption}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
            </div>
            <div className="col col-6 col-md">
              <FormControl
                label="Postal Code"
                name="postalCode"
                value={location.postalCode}
                error={errors.postalCode}
                onChange={handleInputChange}
              />
            </div>
            <div className="col col-12 col-md">
              <FormControl
                label="Description"
                name="description"
                textarea={true}
                required={false}
                value={location.description}
                error={errors.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
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
