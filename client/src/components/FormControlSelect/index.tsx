import React, { ReactNode } from 'react'
import FormError from '@components/FormError'
import { classNames } from '@utils/classNames.util'
import _ from 'lodash'

interface FormControlSelectProps {
  error?: string
  name?: string
  hasError?: boolean
  horizontal?: boolean
  label?: string
  required?: boolean
  children: ReactNode
}

const defaultProps: FormControlSelectProps = {
  error: '',
  hasError: false,
  horizontal: false,
  label: '',
  required: true,
  children: null,
}

const FormControlSelect: React.FC<FormControlSelectProps> = ({
  error,
  hasError,
  horizontal,
  label,
  required,
  name,
  children,
}) => {
  const cx = {
    'form-control': true,
    error: !!error || !!hasError,
    horizontal,
  }

  const formFieldClasses = classNames(cx)

  return (
    <div className={formFieldClasses}>
      {!!label && (
        <label className="label-default-semibold">
          {label}
          {required ? <span className="required">*</span> : <span> </span>}
        </label>
      )}
      <div className="form-control-input">
        {children}
        {!!error && <FormError text={error} name={name} />}
      </div>
    </div>
  )
}

FormControlSelect.defaultProps = defaultProps

export default FormControlSelect
