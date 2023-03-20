import React, { useEffect, useRef, useState } from 'react'
import './VerifyEmail.scss'
import { FaCheckCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { MdArrowBack } from 'react-icons/md'

const VerifyEmail = () => {
  const [hasError, setHasError] = useState(false)
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    switch (id) {
      case 'email':
        setEmail(value)
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(email)
    setSuccess(true)
  }

  return (
    <section id="verify-email-route">
      <div className="container-slim">
        <h1>Verify Email</h1>

        <p className="instructions">
          <span>
            To reset your password, enter your email below and submit. An email
            will be sent to you with instructions about how to complete the
            process.
          </span>
        </p>

        {success && (
          <>
            <div className="success-message">
              <div className="success-message-icon">
                <FaCheckCircle size={32} />
              </div>
              <div className="success-message-text">
                An email was sent to <strong>{email}</strong>. Please check your
                inbox for a link to complete verification. The link will expire
                in 30 minutes.
              </div>
            </div>

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
            <div className="form-input">
              <label htmlFor="email">Email</label>
              <input
                ref={emailRef}
                type="text"
                id="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Email"
              />
            </div>

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
