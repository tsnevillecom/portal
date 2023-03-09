import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './ResetPassword.scss'
import axios from '@api/axios'

const ResetPassword = () => {
  const params = useParams()
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
      <div className="floating">
        <h1>Reset Password</h1>

        <ul id="instructions">
          <li>8 to 24 characters.</li>
          <li>
            {' '}
            Must include uppercase and lowercase letters, a number and a special
            character.
          </li>
          <li>
            Allowed special characters:{' '}
            <span aria-label="exclamation mark">!</span>{' '}
            <span aria-label="at symbol">@</span>{' '}
            <span aria-label="hashtag">#</span>{' '}
            <span aria-label="dollar sign">$</span>{' '}
            <span aria-label="percent">%</span>
          </li>
        </ul>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-input">
            <label htmlFor="password">Password</label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              value={password}
              onChange={handleInputChange}
              placeholder="Password"
            />
          </div>
          <div className="form-input">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Reset Password
          </button>
        </form>
      </div>
    </section>
  )
}

export default ResetPassword
