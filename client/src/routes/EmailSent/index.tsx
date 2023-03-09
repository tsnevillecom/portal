import React from 'react'
import { useLocation } from 'react-router-dom'
import './EmailSent.scss'

const EmailSent = () => {
  const { state } = useLocation()

  console.log(state)

  return (
    <section id="email-sent-route">
      <div>
        <h1>Verify your email</h1>
        <p>
          An email was sent to your email address:{' '}
          <strong>{state.email}</strong>.
        </p>
        <p>Please check your email to verify your account.</p>
      </div>
    </section>
  )
}

export default EmailSent
