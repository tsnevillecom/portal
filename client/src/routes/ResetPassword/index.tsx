import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import './ResetPassword.scss'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import PasswordMeter from '@components/PasswordMeter'

const ResetPassword = () => {
  const params = useParams()
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [viewPassword, setViewPassword] = useState(false)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (passwordRef.current) passwordRef.current.focus()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    switch (id) {
      case 'password':
        setPassword(value)
        break
      case 'confirmPassword':
        setConfirmPassword(value)
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(password, confirmPassword)

    try {
      if (params.token) {
        console.log(params.token)
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

  return (
    <section id="reset-password-route">
      <div className="container-slim">
        <h1>Reset your password</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-input">
            <label htmlFor="password">Password</label>

            <div
              id="viewPassword"
              onClick={() => setViewPassword(!viewPassword)}
            >
              {viewPassword ? <FaEyeSlash /> : <FaEye />}
            </div>

            <input
              ref={passwordRef}
              type={viewPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={handleInputChange}
              placeholder="Password"
            />
          </div>

          <PasswordMeter password={password} />

          <button className="btn btn-primary" type="submit">
            Reset Password
          </button>
        </form>
      </div>
    </section>
  )
}

export default ResetPassword
