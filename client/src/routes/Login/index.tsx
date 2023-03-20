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
import { ToastContext } from '@context/ToastContext'
const LOGIN_URL = '/auth'

interface IHandleLogin {
  tokenResponse?: TokenResponse
  event?: FormEvent<HTMLFormElement>
}

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth()
  const { addToast } = useContext(ToastContext)
  const navigate = useNavigate()

  const emailRef = useRef<HTMLInputElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

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
        addToast('No server response')
      } else if (err.response?.status === 400) {
        addToast('Missing email or password')
      } else if (err.response?.status === 401) {
        addToast('Unauthorized')
      } else if (err.response?.status === 403) {
        addToast('Valid email address required')
      } else if (err.response?.status === 404) {
        addToast('User not found')
      } else if (err.response?.status === 409) {
        addToast('Account requires password')
      } else {
        addToast('Login Failed')
      }
      if (errorRef.current) errorRef.current.focus()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    switch (id) {
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
          <div className="form-input">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              ref={emailRef}
              autoComplete="off"
              onChange={handleInputChange}
              value={email}
              placeholder="Email"
              required
            />
          </div>

          <div className="form-input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={handleInputChange}
              value={password}
              placeholder="Password"
              required
            />
          </div>

          <Link id="reset-password" className="right" to="/reset-password">
            Forgot password?
          </Link>

          <button className="btn btn-primary" type="submit">
            Login
          </button>

          <div className="form-input--checkbox">
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
