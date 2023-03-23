import React, { ReactNode, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './Verify.scss'
import axios from '@api/axios'
import ErrorMessage from '@components/ErrorMessage'
import SuccessMessage from '@components/SuccessMessage'
import Button from '@components/Button'

const Verify = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [submitError, setSubmitError] = useState<ReactNode | string | null>(
    null
  )

  useEffect(() => {
    verify()
  }, [])

  const verify = async () => {
    try {
      await axios.get(`/verify/${params.token}`)
      setSuccess(true)
    } catch (err) {
      console.log(err)
      if (!err?.response) {
        setSubmitError('No server response')
      } else if (err.response.status === 401) {
        navigate('/expired/verify')
      } else if (err.response.status === 404) {
        setSubmitError('User not found')
      } else if (err.response.status === 409) {
        navigate('/verified', { replace: true })
      } else {
        setSubmitError('Internal error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const renderSuccess = () => {
    return (
      <>
        <h1>You are verified!</h1>

        <SuccessMessage>
          <h2>Congratulations! </h2>

          <div>
            Your account has been successfully verified. Let&apos;s log into
            your new account!
          </div>
        </SuccessMessage>

        <Button onClick={() => navigate('/login')}>Login</Button>
      </>
    )
  }

  const renderFailure = () => {
    return (
      <>
        <h1>Verification failed</h1>
        <p>Something went wrong during account verifcation.</p>

        {!!submitError && <ErrorMessage>{submitError}</ErrorMessage>}

        <p>
          Please try again or contact us at <strong>admin@ampd.com</strong> if
          you need further assistance.
        </p>

        <Button onClick={() => navigate('/verify')}>Try again</Button>
      </>
    )
  }

  if (isLoading) return null

  return (
    <section id="verify-route">
      <div className="container-slim">
        {success ? renderSuccess() : renderFailure()}
      </div>
    </section>
  )
}

export default Verify
