import React, { useState, useEffect, RefObject } from 'react'
import FormError from '@components/FormError'
import { classNames } from '@utils/classNames.util'
import './FormControl.scss'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import _ from 'lodash'
import useAutosizeTextArea from '@hooks/useAutosizeTextArea'

interface FormControlProps {
  disabled?: boolean
  error?: string
  hasError?: boolean
  forRef?: RefObject<HTMLInputElement | HTMLTextAreaElement> | null
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
  maxRows?: number
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
  rows: 1,
  maxRows: 4,
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
  maxRows,
  spellCheck,
  textarea,
  togglePassword,
  type,
  value,
}) => {
  const [inputValue, setInputValue] = useState<string>(value || '')
  const [focused, setFocused] = useState(false)
  const [viewPassword, setViewPassword] = useState(false)
  const [inputType, setInputType] = useState(type)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (forRef && textarea)
    useAutosizeTextArea(
      forRef.current as HTMLTextAreaElement,
      inputValue,
      maxRows as number
    )

  useEffect(() => {
    if (value !== inputValue) setInputValue(value || '')
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
          ref={forRef as RefObject<HTMLInputElement> | null}
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
            rows={rows}
            ref={forRef as RefObject<HTMLTextAreaElement> | null}
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
