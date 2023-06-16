import React, { useState, useEffect } from 'react'
import FormError from '@components/FormError'
import { classNames } from '@utils/classNames.util'
import './FormControl.scss'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import _ from 'lodash'

interface FormControlProps {
  disabled?: boolean
  error?: string
  hasError?: boolean
  forRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement> | null
  id?: string
  label?: string
  maxLength?: number
  name: string
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  order?: number
  placeholder?: string | null
  round?: boolean
  rows?: number
  spellCheck?: boolean
  textarea?: boolean
  required?: boolean
  type?: string
  value?: string
  autoComplete?: 'off' | 'on'
  togglePassword?: boolean
}

const defaultProps: FormControlProps = {
  disabled: false,
  error: '',
  hasError: false,
  forRef: null,
  label: '',
  name: '',
  required: true,
  round: false,
  spellCheck: true,
  textarea: false,
  type: 'text',
  value: '',
  autoComplete: 'off',
  togglePassword: false,
}

const FormControl: React.FC<FormControlProps> = ({
  autoComplete,
  disabled,
  error,
  hasError,
  forRef,
  id,
  label,
  maxLength,
  name,
  onChange,
  order,
  placeholder,
  required,
  round,
  rows,
  spellCheck,
  textarea,
  togglePassword,
  type,
  value,
}) => {
  const [inputValue, setInputValue] = useState(value)
  const [focused, setFocused] = useState(false)
  const [viewPassword, setViewPassword] = useState(false)
  const [inputType, setInputType] = useState(type)
  const [textareaRows, setTextareaRows] = useState(rows || 1)

  useEffect(() => {
    if (value !== inputValue) setInputValue(value)
  }, [value])

  useEffect(() => {
    if (type === 'number') setInputType('text') //number does not respect maxLength

    if (type === 'password') {
      setInputType(viewPassword ? 'text' : 'password')
    }
  }, [viewPassword])

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.currentTarget

    if (textarea) {
      const height = target.scrollHeight
      const rowHeight = 26
      const maxRows = 3
      const currRows = Math.ceil(height / rowHeight) - 1
      if (currRows > textareaRows && currRows <= maxRows)
        setTextareaRows(currRows)
    } else {
      switch (type) {
        case 'number':
          target.value = target.value.replace(/\D/g, '')
          break
        case 'tel':
          target.value = target.value.replace(/[^0-9() .\-+]+/g, '')
          break
        default:
          break
      }
    }

    setInputValue(target.value)
    if (onChange) onChange(e)
  }

  const cx = {
    'form-control': true,
    error: !!error || !!hasError,
    round,
    focused: focused && textarea,
  }

  const formFieldClasses = classNames(cx)

  return (
    <div
      data-name={`form-control-${name}`}
      {...(id && { id })}
      className={formFieldClasses}
      {...(!!order && { style: { order } })}
    >
      {!!label && (
        <label className="label-default-semibold" htmlFor={name}>
          {label}
          {required && <span>*</span>}
        </label>
      )}

      {togglePassword && (
        <div id="viewPassword" onClick={() => setViewPassword(!viewPassword)}>
          {viewPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
      )}

      {!textarea && (
        <input
          disabled={disabled}
          ref={forRef as React.Ref<HTMLInputElement> | null}
          name={name}
          {...(!_.isNull(placeholder) && { placeholder: placeholder || label })}
          autoComplete={autoComplete}
          value={inputValue}
          type={inputType}
          spellCheck={spellCheck}
          onChange={(e) => handleOnChange(e)}
          {...(type === 'number' && {
            pattern: '[0-9]*',
            inputMode: 'numeric',
          })}
          {...(maxLength && { maxLength })}
        />
      )}

      {textarea && (
        <div className="form-control--textarea">
          <textarea
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            rows={textareaRows}
            ref={forRef as React.Ref<HTMLTextAreaElement> | null}
            name={name}
            {...(!_.isNull(placeholder) && {
              placeholder: placeholder || label,
            })}
            value={inputValue}
            spellCheck={spellCheck}
            onChange={(e) => handleOnChange(e)}
            {...(maxLength && { maxLength })}
          />
        </div>
      )}
      {!!error && <FormError text={error} name={name} />}
    </div>
  )
}

FormControl.defaultProps = defaultProps

export default FormControl
