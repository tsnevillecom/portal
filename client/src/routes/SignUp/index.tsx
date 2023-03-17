import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './SignUp.scss'
import {
  GoogleOAuthProvider,
  TokenResponse,
  useGoogleLogin,
} from '@react-oauth/google'
import axios, { axiosPrivate } from '@api/axios'
import { ToastContext } from '@context/ToastContext'
import useAuth from '@hooks/useAuth'
import { FcGoogle } from 'react-icons/fc'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import PasswordMeter from '@components/PasswordMeter'

const SignUpForm = () => {
  const { setAuth, persist, setPersist } = useAuth()
  const navigate = useNavigate()
  const { addToast } = useContext(ToastContext)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [viewPassword, setViewPassword] = useState(false)

  const firstNameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (firstNameRef.current) firstNameRef.current.focus()
  }, [])

  const togglePersist = () => {
    setPersist(!persist)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    switch (id) {
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

    const data = { password, email, lastName, firstName }

    try {
      const response = await axios.post('/register', data, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      })
      console.log(response.data)

      navigate('/email-sent', { replace: true, state: { email } })
    } catch (err) {
      console.log(err)
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
      addToast('Google Error')
    }
  }

  return (
    <section id="register-route">
      <div className="container-slim">
        <h1>Sign Up</h1>

        <div id="register-thrid-party">
          <div id="register-with-title">Sign up with Google</div>

          <div className="thrid-party" onClick={() => googleRegister()}>
            <FcGoogle size={50} />
          </div>
        </div>

        <hr />

        <form onSubmit={handleSubmit}>
          <div className="form-input">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={handleInputChange}
              id="firstName"
              ref={firstNameRef}
              placeholder="First Name"
            />
          </div>
          <div className="form-input">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              name=""
              id="lastName"
              value={lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
            />
          </div>
          <div className="form-input">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleInputChange}
              placeholder="Email"
            />
          </div>

          <div className="form-input">
            <label htmlFor="password">Password</label>

            <div
              id="viewPassword"
              onClick={() => setViewPassword(!viewPassword)}
            >
              {viewPassword ? <FaEyeSlash /> : <FaEye />}
            </div>

            <input
              type={viewPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={handleInputChange}
              placeholder="Password"
            />
          </div>

          <PasswordMeter password={password} />

          <button className="btn btn-primary" type="submit">
            Sign Up
          </button>
        </form>

        <div className="form-input--checkbox">
          <input
            type="checkbox"
            id="persist"
            onChange={togglePersist}
            checked={!!persist}
          />
          <label htmlFor="persist">Trust This Device</label>
        </div>

        <hr />

        <p>
          Already have an Account?
          <br />
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
