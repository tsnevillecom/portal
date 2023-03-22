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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)

  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (passwordRef.current) passwordRef.current.focus()
    validateToken()
  }, [])

  const validateToken = async () => {
    if (!params.token) {
      setFormError('Token missing')
      setIsLoading(false)
      return
    }

    try {
      await axios.get(`/reset/password/${params.token}`)
    } catch (err) {
      navigate('/expired/password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (formError) setFormError(null)
    if (errors[name]) setErrors(_.omit(errors, name))

    switch (name) {
      case 'password':
        setPassword(value)
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

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

    setIsSubmitting(true)

    try {
      await axios.post('/reset/password/verify', data, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      setSuccess(true)
    } catch (err) {
      console.log(err)

      if (!err?.response) {
        setFormError('No server response')
      } else if (err.response.status === 401) {
        setFormError('Password reset link expired')
      } else if (err.response.status === 404) {
        setFormError('User not found')
      } else {
        setFormError('Internal error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderSuccess = () => {
    return (
      <>
        <h1>Reset password success!</h1>

        <SuccessMessage>
          <div>Your password has been successfully reset.</div>
          <div>Let&apos;s log into your account!</div>
        </SuccessMessage>

        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          Login
        </button>
      </>
    )
  }

  const renderForm = () => {
    return (
      <>
        <h1>
          Reset password
          <span>* required</span>
        </h1>

        {!!formError && <ErrorMessage>{formError}</ErrorMessage>}

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
    )
  }

  if (isLoading) return null

  return (
    <section id="reset-password-verify-route">
      <div className="container-slim">
        {success ? renderSuccess() : renderForm()}
      </div>
    </section>
  )
}

export default ResetPasswordVerify
