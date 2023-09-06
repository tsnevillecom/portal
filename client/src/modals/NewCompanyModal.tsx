import Button from '@components/Button'
import FormControl from '@components/FormControl'
import Modal from '@components/Modal'
import ModalBody from '@components/Modal/ModalBody'
import ModalFooter from '@components/Modal/ModalFooter'
import { ModalContext } from '@context/ModalProvider'
import { Company, Errors, NewCompany, Rules } from '@types'
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
import FormControlSelect from '@components/FormControlSelect'

interface NewCompanyModalProps {
  onSuccess: (company: Company) => void
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

const initialCompanyState = {
  name: '',
  type: '',
  accountId: '',
  phone: '',
  address1: '',
  city: '',
  state: '',
  postalCode: '',
  active: true,
}

const NewCompanyModal: React.FC<NewCompanyModalProps> = ({ onSuccess }) => {
  const axiosPrivate = useAxiosPrivate()
  const { hideModal } = useContext(ModalContext)

  const nameRef = useRef<HTMLInputElement>(null)

  const [errors, setErrors] = useState<Errors>({})
  const [company, setCompany] = useState<NewCompany>(initialCompanyState)
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
      ...trimObjValues(company),
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
      const response = await axiosPrivate.post('/companies', data)
      onSuccess(response.data)
      hideModal()
    } catch (error) {
      console.log(error)
      setSubmitError('Could not create new company. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (submitError) setSubmitError(null)
    if (errors[name]) setErrors(_.omit(errors, name))
    const updatedCompany = { ...company, ...{ [name]: value } }
    setCompany(updatedCompany)
  }

  const handleOnSelect = (name: string, option: StateOption) => {
    const { value } = option
    if (submitError) setSubmitError(null)
    if (errors[name]) setErrors(_.omit(errors, name))
    const updatedCompany = { ...company, ...{ [name]: value } }
    setCompany(updatedCompany)
  }

  return (
    <Modal title="New Company">
      <form onSubmit={handleSubmit}>
        <ModalBody>
          {!!submitError && <ErrorMessage>{submitError}</ErrorMessage>}

          <FormControl
            label="Name"
            forRef={nameRef}
            name="name"
            value={company.name}
            error={errors.name}
            onChange={handleInputChange}
            horizontal
          />
          <FormControl
            label="Account ID"
            name="accountId"
            value={company.accountId}
            error={errors.accountId}
            onChange={handleInputChange}
            horizontal
          />
          <FormControl
            label="Company Type"
            name="type"
            value={company.type}
            error={errors.type}
            onChange={handleInputChange}
            horizontal
          />
          <FormControl
            label="Phone"
            name="phone"
            value={company.phone}
            error={errors.phone}
            onChange={handleInputChange}
            horizontal
          />
          <FormControl
            label="Address 1"
            name="address1"
            value={company.address1}
            error={errors.address1}
            onChange={handleInputChange}
            horizontal
          />
          <FormControl
            label="Address 2"
            name="address2"
            required={false}
            value={company.address2}
            error={errors.address2}
            onChange={handleInputChange}
            horizontal
          />
          <FormControl
            label="City"
            name="city"
            value={company.city}
            error={errors.city}
            onChange={handleInputChange}
            horizontal
          />

          <FormControlSelect
            label="State"
            name="state"
            error={errors.state}
            horizontal
          >
            <Select
              menuPlacement="top"
              defaultValue={_.find(
                statesOption,
                (option) => company.state === option.value
              )}
              onChange={(option) =>
                handleOnSelect('state', option as StateOption)
              }
              options={statesOption}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </FormControlSelect>

          <FormControl
            label="Postal Code"
            name="postalCode"
            value={company.postalCode}
            error={errors.postalCode}
            onChange={handleInputChange}
            horizontal
          />
        </ModalBody>
        <ModalFooter>
          <Button style="secondary" onClick={hideModal}>
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

export default NewCompanyModal
