import React, { FormEvent, useContext } from 'react'
import './Login.scss'
import { useRef, useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import {
  useGoogleLogin,
  TokenResponse,
  GoogleOAuthProvider,
} from '@react-oauth/google'

import { axiosPrivate } from '../../api/axios'
import { ToastContext } from 'src/context/ToastContext'
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

      setAuth({ accessToken, user, isAuthenticated: true })
      setEmail('')
      setPassword('')
      navigate('/', { replace: true })
    } catch (err) {
      if (!err?.response) {
        addToast('No server eesponse')
      } else if (err.response?.status === 400) {
        addToast('Missing email or password')
      } else if (err.response?.status === 401) {
        addToast('Unauthorized')
      } else if (err.response?.status === 403) {
        addToast('Valid email address required')
      } else {
        addToast('Login Failed')
      }
      if (errorRef.current) errorRef.current.focus()
    }
  }

  return (
    <section id="login-route">
      <div className="floating">
        <h1>Sign In</h1>
        <form onSubmit={(event) => handleLogin({ event })} noValidate>
          <div className="form-input">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              ref={emailRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
              required
            />
          </div>

          <button type="submit">Sign in</button>

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

        <button onClick={() => googleLogin()}>Sign in with Google</button>

        <p>
          Need an Account?
          <br />
          <Link to="/register">Sign Up</Link>
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
