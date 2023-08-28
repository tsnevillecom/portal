import Button from '@components/Button'
import FormControl from '@components/FormControl'
import Modal from '@components/Modal'
import ModalBody from '@components/Modal/ModalBody'
import ModalFooter from '@components/Modal/ModalFooter'
import { ModalContext } from '@context/ModalProvider'
import { Company, CompanyType, Errors, Rules } from '@types'
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

interface EditCompanyModalProps {
  company: Company
  onSuccess: () => void
}

type CompanyTypeOption = {
  value: CompanyType
  label: string
}

type StateOption = {
  value: string
  label: string
}

const companyTypeOptions: CompanyTypeOption[] = [
  { value: 'PRIVATE', label: 'Private Company' },
  { value: 'DSO', label: 'DSO' },
]

const statesOptions: StateOption[] = Object.entries(CONSTANTS.STATES).map(
  ([k, v]) => {
    return {
      value: k,
      label: v,
    }
  }
)

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({
  company: originalCompany,
  onSuccess,
}) => {
  const axiosPrivate = useAxiosPrivate()
  const { hideModal } = useContext(ModalContext)

  const nameRef = useRef<HTMLInputElement>(null)

  const [isDirty, setIsDirty] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [company, setCompany] = useState<Company>(originalCompany)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<ReactNode | string | null>(
    null
  )

  useEffect(() => {
    if (nameRef.current) nameRef.current.focus()
  }, [])

  useEffect(() => {
    const isDirty = !_.isEqual(originalCompany, company)
    setIsDirty(isDirty)
  }, [company])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isDirty) {
      hideModal()
      return
    }

    const data = {
      ...trimObjValues(company),
    }

    const rules: Rules = {
      name: {
        required: true,
      },
      accountId: {
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
      await axiosPrivate.patch(`/companies/${company._id}`, data)
      onSuccess()
      hideModal()
    } catch (error) {
      console.log(error)
      setSubmitError('Could not update company. Try again.')
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

  const handleOnSelect = (
    name: string,
    option: CompanyTypeOption | StateOption
  ) => {
    const { value } = option
    if (submitError) setSubmitError(null)
    if (errors[name]) setErrors(_.omit(errors, name))
    const updatedCompany = { ...company, ...{ [name]: value } }
    setCompany(updatedCompany)
  }

  return (
    <Modal title="Edit Company">
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

          <div className="form-control horizontal">
            <label className="label-default-semibold">
              Company Type<span>*</span>
            </label>

            <div className="form-control-input">
              <Select
                defaultValue={_.find(
                  companyTypeOptions,
                  (option) => company.type === option.value
                )}
                onChange={(option) =>
                  handleOnSelect('type', option as CompanyTypeOption)
                }
                options={companyTypeOptions}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>

          <FormControl
            label="Account ID"
            name="accountId"
            value={company.accountId}
            error={errors.accountId}
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

          <div className="form-control horizontal">
            <label className="label-default-semibold">
              State<span>*</span>
            </label>
            <div className="form-control-input">
              <Select
                defaultValue={_.find(
                  statesOptions,
                  (option) => company.state === option.value
                )}
                onChange={(option) =>
                  handleOnSelect('state', option as StateOption)
                }
                options={statesOptions}
                className="react-select-container"
                classNamePrefix="react-select"
                menuShouldScrollIntoView={true}
              />
            </div>
          </div>

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

export default EditCompanyModal
