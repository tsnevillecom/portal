import React, { useEffect, useRef, useState } from 'react'
import './ResetPasswordEmail.scss'
import { Link } from 'react-router-dom'
import { MdArrowBack } from 'react-icons/md'
import FormControl from '@components/FormControl'
import SuccessMessage from '@components/SuccessMessage'
import { Errors, Rules } from '@types'
import { validateForm } from '@utils/validateForm'
import _ from 'lodash'
import axios from '@api/axios'
import ErrorMessage from '@components/ErrorMessage'

const ResetPasswordEmail = () => {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (errors[name]) setErrors(_.omit(errors, name))
    setSubmitError(null)

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
      if (error.response.status === 401) {
        setSubmitError('Could not send email. Try again.')
      } else if (error.response.status === 404) {
        setSubmitError('Account does not exist')
      } else {
        setSubmitError('Passwrod reset failed. Try again.')
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
              An email was sent to <strong>{email}</strong>.
              <br />
              <br />
              Please check your inbox for a link to complete the password reset.
              The link will expire in 30 minutes.
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

        <hr />

        <p className="footer">
          <Link to="/login" className="back" replace>
            <MdArrowBack /> Back to Login
          </Link>
        </p>
      </div>
    </section>
  )
}

export default ResetPasswordEmail