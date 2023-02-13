import React, { FormEvent } from 'react'
import './Login.scss'
import { useRef, useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  useGoogleLogin,
  TokenResponse,
  GoogleOAuthProvider,
} from '@react-oauth/google'

import { axiosPrivate } from '../../api/axios'
const LOGIN_URL = '/auth'

interface IHandleLogin {
  tokenResponse?: TokenResponse
  event?: FormEvent<HTMLFormElement>
}

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const emailRef = useRef<HTMLInputElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  const [email, setemail] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('')
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

      setAuth({ email, accessToken, user, isAuthenticated: true })
      setemail('')
      setPassword('')
      navigate(from, { replace: true })
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No server eesponse')
      } else if (err.response?.status === 400) {
        setErrMsg('Missing email or password')
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized')
      } else if (err.response?.status === 403) {
        setErrMsg('Valid email address required')
      } else {
        setErrMsg('Login Failed')
      }
      if (errorRef.current) errorRef.current.focus()
    }
  }

  return (
    <div id="login-route">
      <section>
        <div
          ref={errorRef}
          className={errMsg ? 'errmsg' : 'offscreen'}
          aria-live="assertive"
        >
          {errMsg}
        </div>
        <h1>Sign In</h1>
        <form onSubmit={(event) => handleLogin({ event })} noValidate>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            ref={emailRef}
            autoComplete="off"
            onChange={(e) => setemail(e.target.value)}
            value={email}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <button>Sign in</button>

          <div className="persistCheck">
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
          <span className="line">
            <Link to="/register">Sign Up</Link>
          </span>
        </p>
      </section>
    </div>
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
