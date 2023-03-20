import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './EmailSent.scss'

const EmailSent = () => {
  const { state } = useLocation()

  console.log(state)

  return (
    <section id="email-sent-route">
      {!!state?.email && (
        <div>
          <h1>Verify your email</h1>
          <p>
            An email was sent to <strong>{state.email}</strong>.
          </p>
          <p>Please check your email to verify your account.</p>
        </div>
      )}

      {!state?.email && (
        <div>
          <h1>Something went wrong</h1>
          <p>An email could not be sent. Please try again.</p>
          <Link to="/">Home</Link>
        </div>
      )}
    </section>
  )
}

export default EmailSent
