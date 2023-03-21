import React, { useEffect, useRef, useState } from 'react'
import './VerifyEmail.scss'
import FormControl from '@components/FormControl'
import SuccessMessage from '@components/SuccessMessage'
import { Errors, Rules } from '@types'
import { validateForm } from '@utils/validateForm'
import _ from 'lodash'
import { useLocation } from 'react-router-dom'

const VerifyEmail = () => {
  const { state } = useLocation()

  const [email, setEmail] = useState(state?.email || '')
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
        email: true,
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
        <h1>
          Verify Email
          {!success && <span>* required</span>}
        </h1>

        <h3>
          <strong>Your account has not been verified.</strong>
        </h3>

        {success && (
          <>
            <SuccessMessage>
              An email was sent to <strong>{email}</strong>.
              <br />
              <br />
              Please check your inbox for a link to complete verification. The
              link will expire in 1 day.
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
          <>
            <p className="instructions">
              Enter your email below and submit. An email will be sent to you
              with instructions about how to complete the process.
            </p>

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
          </>
        )}
      </div>
    </section>
  )
}

export default VerifyEmail
