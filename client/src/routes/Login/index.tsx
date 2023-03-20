import React, { FormEvent, useContext } from 'react'
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

  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus()
  }, [])

  useEffect(() => {
    //clear inline errors
  }, [email, password])

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
        response = await axiosPrivate.post(
          LOGIN_URL,
          JSON.stringify({ email, password })
        )
      }

      const accessToken = response.data?.accessToken
      const user = response.data?.user

      setAuth({ accessToken, user, isAuthenticated: user.isVerified })
      setEmail('')
      setPassword('')
      navigate('/', { replace: true })
    } catch (err) {
      if (!err?.response) {
        setError('No server response')
      } else if (err.response.status === 400) {
        setError('Missing email or password')
      } else if (err.response.status === 401) {
        setError('Unauthorized')
      } else if (err.response.status === 403) {
        setError('Valid email address required')
      } else if (err.response.status === 404) {
        setError('User not found')
      } else if (err.response.status === 409) {
        setError('Account requires password')
      } else {
        setError('Login Failed')
      }
      if (errorRef.current) errorRef.current.focus()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (error) setError(null)

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
        <h1>Login</h1>

        {!!error && <ErrorMessage>{error}</ErrorMessage>}

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
            onChange={handleInputChange}
          />

          <FormControl
            label="Password"
            name="password"
            type="password"
            value={password}
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

        <p className="footer">
          Don&apos;t have an account?{' '}
          <Link to="/sign-up" replace>
            Sign Up
          </Link>
        </p>

        <p className="footer">
          <span>By continuing, you agree to our</span>
          <br />
          <a>User Agreement</a> <span>and</span> <a>Privacy Policy</a>.
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
