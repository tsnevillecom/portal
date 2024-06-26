import Button from '@components/Button'
import SuccessMessage from '@components/SuccessMessage'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export const AccountVerified = () => {
  const navigate = useNavigate()

  return (
    <section id="account-verified-route">
      <div className="container-slim">
        <h1>You are already verified!</h1>

        <SuccessMessage>
          <div>
            It looks like your account has already been verified. Please login.
          </div>
        </SuccessMessage>

        <p className="small">
          Contact us at <a href="mailto:admin@ampd.com">admin@ampd.com</a> if
          you need further assistance.
        </p>

        <Button onClick={() => navigate('/login')}>Login</Button>
      </div>
    </section>
  )
}

export default AccountVerified
