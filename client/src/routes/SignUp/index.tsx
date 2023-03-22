import React, { useState, useEffect, useRef, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './SignUp.scss'
import {
  GoogleOAuthProvider,
  TokenResponse,
  useGoogleLogin,
} from '@react-oauth/google'
import axios, { axiosPrivate } from '@api/axios'
import useAuth from '@hooks/useAuth'
import { BsGoogle } from 'react-icons/bs'
import PasswordMeter from '@components/PasswordMeter'
import SuccessMessage from '@components/SuccessMessage'
import ErrorMessage from '@components/ErrorMessage'
import FormControl from '@components/FormControl'
import { Errors, Rules } from '@types'
import { validateForm } from '@utils/validateForm'
import _ from 'lodash'
import ResendEmail from '@components/ResendEmail'

const SignUpForm = () => {
  const { setAuth, persist, setPersist } = useAuth()
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(null)
  const [resendStatus, setResendStatus] = useState<'success' | 'error' | null>(
    null
  )
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<ReactNode | string | null>(
    null
  )
  const [errors, setErrors] = useState<Errors>({})

  const firstNameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (firstNameRef.current) firstNameRef.current.focus()
  }, [])

  const togglePersist = () => {
    setPersist(!persist)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (submitError) setSubmitError(null)
    if (errors[name]) setErrors(_.omit(errors, name))

    switch (name) {
      case 'firstName':
        setFirstName(value)
        break
      case 'lastName':
        setLastName(value)
        break
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password: password,
    }

    const rules: Rules = {
      firstName: {
        required: true,
      },
      lastName: {
        required: true,
      },
      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
        password: true,
      },
    }

    const errors = validateForm(data, rules)
    setErrors(errors)
    if (!_.isEmpty(errors)) return

    try {
      const response = await axios.post('/register', data, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })

      const token = response.data?.token
      setToken(token)
      setSuccess(true)
    } catch (error) {
      console.log(error)
      handleError(error)
    }
  }

  const googleRegister = useGoogleLogin({
    onSuccess: (tokenResponse: TokenResponse) =>
      handleGoogleRegister(tokenResponse),
  })

  const handleGoogleRegister = async (tokenResponse: TokenResponse) => {
    try {
      const response = await axiosPrivate.post('/google/register', {
        googleAccessToken: tokenResponse.access_token,
      })

      const accessToken = response.data?.accessToken
      const user = response.data?.user

      setAuth({ accessToken, user, isAuthenticated: true })
      navigate('/', { replace: true })
    } catch (error) {
      console.log(error)
      handleError(error, true)
    }
  }

  const handleError = (error: any, isGoogle = false) => {
    if (!error?.response) {
      setSubmitError('No server response')
    } else if (error.response.status === 401 && !isGoogle) {
      setSubmitError('Could not send verification email')
    } else if (error.response.status === 401 && isGoogle) {
      setSubmitError('Could not retrieve Google account')
    } else if (error.response.status === 409) {
      setSubmitError(
        <>
          User already exists. <Link to="/login">Login</Link>
        </>
      )
    } else {
      setSubmitError('Registration failed. Try again.')
    }
  }

  const handleResendEmail = async () => {
    const data = { email, token }

    try {
      await axios.post('/register/resend', data, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })

      setResendStatus('success')
    } catch (error) {
      console.log(error)
      setResendStatus('error')
    }
  }

  const renderSuccess = () => {
    return (
      <>
        <h1>Verify Account</h1>

        <SuccessMessage>
          An email was sent to <strong>{email}</strong>.
          <br />
          <br />
          Please check your inbox for a link to verify your account. The link
          will expire in 1 day.
        </SuccessMessage>

        <ResendEmail onClick={handleResendEmail} resendStatus={resendStatus} />
      </>
    )
  }

  const renderForm = () => {
    return (
      <>
        <h1>
          Sign Up
          <span>* required</span>
        </h1>

        {!!submitError && <ErrorMessage>{submitError}</ErrorMessage>}

        <button className="btn btn-secondary" onClick={() => googleRegister()}>
          <BsGoogle size={16} />
          Continue with Google
        </button>

        <div className="or">
          <hr />
          <div>OR</div>
          <hr />
        </div>

        <form onSubmit={handleSubmit}>
          <FormControl
            label="First Name"
            forRef={firstNameRef}
            name="firstName"
            value={firstName}
            error={errors.firstName}
            onChange={handleInputChange}
          />

          <FormControl
            label="Last Name"
            name="lastName"
            value={lastName}
            error={errors.lastName}
            onChange={handleInputChange}
          />

          <FormControl
            label="Email"
            name="email"
            value={email}
            error={errors.email}
            onChange={handleInputChange}
          />

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
            Sign Up
          </button>
        </form>

        <div className="form-control--checkbox">
          <input
            type="checkbox"
            id="persist"
            onChange={togglePersist}
            checked={!!persist}
          />
          <label htmlFor="persist">Trust This Device</label>
        </div>
      </>
    )
  }

  return (
    <section id="register-route">
      <div className="container-slim">
        {success ? renderSuccess() : renderForm()}

        <hr />

        <p className="footer">
          Already have an Account?{' '}
          <Link to="/login" replace>
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}

const GoogleRegister = () => {
  return (
    <GoogleOAuthProvider
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
    >
      <SignUpForm />
    </GoogleOAuthProvider>
  )
}

export default GoogleRegister
