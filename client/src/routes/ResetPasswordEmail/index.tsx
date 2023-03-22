import React, { useEffect, useRef, useState } from 'react'
import './ResetPasswordEmail.scss'
import { Link, useLocation } from 'react-router-dom'
import { MdArrowBack } from 'react-icons/md'
import FormControl from '@components/FormControl'
import SuccessMessage from '@components/SuccessMessage'
import { Errors, Rules } from '@types'
import { validateForm } from '@utils/validateForm'
import _ from 'lodash'
import axios from '@api/axios'
import ErrorMessage from '@components/ErrorMessage'
import ResendEmail from '@components/ResendEmail'

const ResetPasswordEmail = () => {
  const { state } = useLocation()
  const [email, setEmail] = useState(state?.email || '')
  const [success, setSuccess] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (submitError) setSubmitError(null)
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

    try {
      await axios.post('/reset/password', data, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      setSuccess(true)
    } catch (error) {
      if (!error?.response) {
        setSubmitError('No server response')
      } else if (error.response.status === 401) {
        setSubmitError('Could not send email. Try again.')
      } else if (error.response.status === 404) {
        setSubmitError('Account does not exist')
      } else {
        setSubmitError('Password reset failed. Try again.')
      }
    }
  }

  return (
    <section id="reset-password-email-route">
      <div className="container-slim">
        <h1>
          Reset password
          {!success && <span>* required</span>}
        </h1>

        {success && (
          <>
            <SuccessMessage>
              <div>
                A password reset email was sent to:
                <br />
                <strong>{email}</strong>
              </div>

              <div>
                Please click the link in that message to reset your password.
                The link will expire in 30 minutes.
              </div>
            </SuccessMessage>

            <ResendEmail onClick={() => setSuccess(false)} />
          </>
        )}

        {!success && (
          <>
            {!!submitError && <ErrorMessage>{submitError}</ErrorMessage>}

            <p className="instructions">
              To reset your password, enter your email below and click
              &quot;Send Email&quot;. An email will be sent to you with
              instructions about how to complete the process.
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

        <div className="or">
          <hr />
          <div>OR</div>
          <hr />
        </div>

        <p className="callout">
          <Link to="/login" className="back" replace>
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}

export default ResetPasswordEmail
