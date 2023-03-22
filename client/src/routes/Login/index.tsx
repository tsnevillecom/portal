import React, { FormEvent, ReactNode, useContext } from 'react'
import './Login.scss'
import { useRef, useState, useEffect } from 'react'
import useAuth from '@hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import {
  useGoogleLogin,
  TokenResponse,
  GoogleOAuthProvider,
} from '@react-oauth/google'
import { BsGoogle } from 'react-icons/bs'
import { axiosPrivate } from '@api/axios'
import FormControl from '@components/FormControl'
import ErrorMessage from '@components/ErrorMessage'
import { Errors, Rules } from '@types'
import { validateForm } from '@utils/validateForm'
import _ from 'lodash'
const LOGIN_URL = '/auth'

interface IHandleLogin {
  tokenResponse?: TokenResponse
  event?: FormEvent<HTMLFormElement>
}

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth()
  const navigate = useNavigate()

  const emailRef = useRef<HTMLInputElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  const [submitError, setSubmitError] = useState<ReactNode | string | null>(
    null
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus()
  }, [])

  const togglePersist = () => {
    setPersist(!persist)
  }

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse: TokenResponse) => handleLogin({ tokenResponse }),
  })

  const handleLogin = async ({ event, tokenResponse }: IHandleLogin) => {
    if (event) event.preventDefault()

    try {
      let response
      if (tokenResponse) {
        response = await axiosPrivate.post('/google/login', {
          googleAccessToken: tokenResponse.access_token,
        })
      } else {
        const data = {
          email: email.trim(),
          password: password,
        }

        const rules: Rules = {
          email: {
            required: true,
            email: true,
          },
          password: {
            required: true,
          },
        }

        const errors = validateForm(data, rules)
        setErrors(errors)
        if (!_.isEmpty(errors)) return

        response = await axiosPrivate.post(
          LOGIN_URL,
          JSON.stringify({ email, password })
        )
      }

      const accessToken = response.data?.accessToken
      const user = response.data?.user

      setAuth({ accessToken, user, isAuthenticated: true })
      setEmail('')
      setPassword('')
      navigate('/', { replace: true })
    } catch (err) {
      if (!err?.response) {
        setSubmitError('No server response')
      } else if (err.response.status === 400) {
        setSubmitError('Valid email or password required')
      } else if (err.response.status === 401) {
        setSubmitError(
          <>
            Verify your account to continue.{' '}
            <Link to="/verify" state={{ email }}>
              Verify Account
            </Link>
          </>
        )
      } else if (err.response.status === 403) {
        setSubmitError('Valid email address required')
      } else if (err.response.status === 404) {
        setSubmitError('User not found')
      } else if (err.response.status === 409) {
        setSubmitError(
          <>
            Reset your password to continue.{' '}
            <Link to="/reset-password" state={{ email }}>
              Reset Password
            </Link>
          </>
        )
      } else {
        setSubmitError('Login failed')
      }
      if (errorRef.current) errorRef.current.focus()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (submitError) setSubmitError(null)

    switch (name) {
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
    }
  }

  return (
    <section id="login-route">
      <div className="container-slim">
        <h1>
          Login<span>* required</span>
        </h1>

        {!!submitError && <ErrorMessage>{submitError}</ErrorMessage>}

        <button className="btn btn-secondary" onClick={() => googleLogin()}>
          <BsGoogle size={16} />
          Continue with Google
        </button>

        <div className="or">
          <hr />
          <div>OR</div>
          <hr />
        </div>

        <form onSubmit={(event) => handleLogin({ event })} noValidate>
          <FormControl
            label="Email"
            forRef={emailRef}
            name="email"
            value={email}
            error={errors.email}
            onChange={handleInputChange}
          />

          <FormControl
            label="Password"
            name="password"
            type="password"
            value={password}
            error={errors.password}
            onChange={handleInputChange}
          />

          <Link id="reset-password" className="right" to="/reset-password">
            Forgot password?
          </Link>

          <button className="btn btn-primary" type="submit">
            Login
          </button>

          <div className="form-control--checkbox">
            <input
              type="checkbox"
              id="persist"
              onChange={togglePersist}
              checked={!!persist}
            />
            <label htmlFor="persist">Trust This Device</label>
          </div>
        </form>

        <hr />

        <p className="callout">
          Don&apos;t have an account?{' '}
          <Link to="/sign-up" replace>
            Sign Up
          </Link>
        </p>

        <hr />

        <p className="callout small muted">
          By continuing, you agree to our
          <br />
          <a>User Agreement</a> and <a>Privacy Policy</a>.
        </p>
      </div>
    </section>
  )
}

const GoogleLogin = () => {
  return (
    <GoogleOAuthProvider
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
    >
      <Login />
    </GoogleOAuthProvider>
  )
}

export default GoogleLogin
