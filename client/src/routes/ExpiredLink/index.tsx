import React, { useState, useEffect } from 'react'
import ErrorMessage from '@components/ErrorMessage'
import { useNavigate, useParams } from 'react-router-dom'
import _ from 'lodash'
import Button from '@components/Button'

export const ExpiredLink = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [link] = useState<string | null>(params.link || null)

  useEffect(() => {
    if (link && !_.includes(['password', 'verify'], link)) {
      navigate('/login')
    }
  }, [])

  const renderAction = () => {
    let to = ''
    let btnText = ''

    switch (link) {
      case 'password':
        to = '/reset-password'
        btnText = 'Reset Password'
        break
      case 'verify':
        to = '/verify'
        btnText = 'Verify Account'
        break
    }

    return <Button onClick={() => navigate(to)}>{btnText}</Button>
  }

  return (
    <section id="account-verified-route">
      <div className="container-slim">
        <h1>Expired link</h1>

        <ErrorMessage full center>
          <h2>Sorry!</h2>
          <div>This link has been used or has expired.</div>
          <div>Please try again.</div>
        </ErrorMessage>

        <p className="small muted">
          Contact us at <a href="mailto:admin@ampd.com">admin@ampd.com</a> if
          you need further assistance.
        </p>

        {renderAction()}
      </div>
    </section>
  )
}

export default ExpiredLink
