import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './ResetPasswordVerify.scss'
import PasswordMeter from '@components/PasswordMeter'
import FormControl from '@components/FormControl'
import { Errors, Rules } from '@types'
import _ from 'lodash'
import { validateForm } from '@utils/validateForm'
import axios from '@api/axios'
import ErrorMessage from '@components/ErrorMessage'
import SuccessMessage from '@components/SuccessMessage'

const ResetPasswordVerify = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (passwordRef.current) passwordRef.current.focus()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (errors[name]) setErrors(_.omit(errors, name))

    switch (name) {
      case 'password':
        setPassword(value)
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!params.token) {
      console.log(params.token)
    }

    const data = { password, token: params.token as string }
    const rules: Rules = {
      password: {
        required: true,
        password: true,
      },
    }

    const errors = validateForm(data, rules)
    setErrors(errors)
    if (!_.isEmpty(errors)) return

    console.log(password)

    try {
      await axios.post('/reset/password/verify', data, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      setSuccess(true)
    } catch (err) {
      console.log(err)

      if (!err?.response) {
        setSubmitError('No server response')
      } else if (err.response.status === 401) {
        setSubmitError('Password reset link expired')
      } else if (err.response.status === 404) {
        setSubmitError('User not found')
      } else {
        setSubmitError('Internal error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="reset-password-verify-route">
      <div className="container-slim">
        {success && (
          <>
            <h1>Reset password success!</h1>

            <SuccessMessage>
              Your password has been successfully reset. Let&apos;s log into
              your account!
            </SuccessMessage>

            <button
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </>
        )}

        {!success && (
          <>
            <h1>
              Reset password
              <span>* required</span>
            </h1>

            {!!submitError && <ErrorMessage>{submitError}</ErrorMessage>}

            <form onSubmit={handleSubmit} noValidate>
              <FormControl
                label="Password"
                name="password"
                type="password"
                togglePassword={true}
                value={password}
                error={errors.password}
                onChange={handleInputChange}
              />

              <PasswordMeter password={password} />

              <button className="btn btn-primary" type="submit">
                Reset Password
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  )
}

export default ResetPasswordVerify
