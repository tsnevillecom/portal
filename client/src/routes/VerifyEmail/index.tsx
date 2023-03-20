import React, { useEffect, useRef, useState } from 'react'
import './VerifyEmail.scss'
import { FaCheckCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { MdArrowBack } from 'react-icons/md'
import FormControl from '@components/FormControl'
import SuccessMessage from '@components/SuccessMessage'
import { Errors, Rules } from '@types'
import { validateForm } from '@utils/validateForm'
import _ from 'lodash'

const VerifyEmail = () => {
  const [hasError, setHasError] = useState(false)
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (errors[name]) setErrors(_.omit(errors, name))

    switch (name) {
      case 'email':
        setEmail(value)
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = { email: email.trim() }
    const rules: Rules = {
      email: {
        required: true,
      },
    }

    const errors = validateForm(data, rules)
    setErrors(errors)
    if (!_.isEmpty(errors)) return

    console.log(email)
    setSuccess(true)
  }

  return (
    <section id="verify-email-route">
      <div className="container-slim">
        <h1>Verify Email</h1>

        <p className="instructions">
          <strong>Your account has not been verified.</strong>
        </p>
        <p className="instructions">
          <span>
            Enter your email below and submit. An email will be sent to you with
            instructions about how to complete the process.
          </span>
        </p>

        {success && (
          <>
            <SuccessMessage>
              An email was sent to <strong>{email}</strong>. Please check your
              inbox for a link to complete verification. The link will expire in
              30 minutes.
            </SuccessMessage>

            <p>
              <span>
                Didn&apos;t receive an email? Check your spam folder or click{' '}
              </span>
              <a onClick={() => setSuccess(false)}>here</a>
              <span> to resend.</span>
            </p>
          </>
        )}

        {!success && (
          <form onSubmit={handleSubmit} noValidate>
            <FormControl
              label="Email"
              forRef={emailRef}
              name="email"
              value={email}
              error={errors.email}
              onChange={handleInputChange}
            />

            <button className="btn btn-primary" type="submit">
              Send Email
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default VerifyEmail
