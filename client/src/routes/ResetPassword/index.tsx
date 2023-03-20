import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import './ResetPassword.scss'
import PasswordMeter from '@components/PasswordMeter'
import FormControl from '@components/FormControl'
import { Errors } from '@types'

const ResetPassword = () => {
  const params = useParams()
  const [hasError, setHasError] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')

  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (passwordRef.current) passwordRef.current.focus()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    switch (name) {
      case 'password':
        setErrors({ password: '' })
        setPassword(value)
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!password) {
      setErrors({ password: 'This field is required' })
      return
    }

    console.log(password)

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
      </div>
    </section>
  )
}

export default ResetPassword
