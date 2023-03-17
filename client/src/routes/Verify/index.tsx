import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './Verify.scss'
import axios from '@api/axios'

const Verify = () => {
  const params = useParams()
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    verify()
  }, [])

  const verify = async () => {
    try {
      if (params.token) {
        await axios.get(`/verify/${params.token}`)
      } else {
        setHasError(true)
      }
    } catch (error) {
      console.log(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return null

  return (
    <section id="verify-route">
      {hasError && (
        <div>
          <h1>Verification Failed</h1>
          <p>Something went wrong during verifcation.</p>
          <Link to="/sign-up">Try to sign up again</Link>
        </div>
      )}

      {!hasError && (
        <div>
          <h1>You are verified!</h1>
          <p>Log into your new account!</p>
          <Link to="/login">Login</Link>
        </div>
      )}
    </section>
  )
}

export default Verify
