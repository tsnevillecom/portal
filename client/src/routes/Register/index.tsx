import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.scss'
import {
  GoogleOAuthProvider,
  TokenResponse,
  useGoogleLogin,
} from '@react-oauth/google'
import { axiosPrivate } from 'src/api/axios'
import { ToastContext } from 'src/context/ToastContext'
import useAuth from 'src/hooks/useAuth'
import { FcGoogle } from 'react-icons/fc'

function RegistrationForm() {
  const { setAuth, persist, setPersist } = useAuth()
  const navigate = useNavigate()
  const { addToast } = useContext(ToastContext)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

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
      case 'confirmPassword':
        setConfirmPassword(value)
        break
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(firstName, lastName, email, password, confirmPassword)
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
      <div className="floating">
        <h1>Register</h1>

        <div id="register-thrid-party">
          <div id="register-with-title">Register with Google</div>

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
              onChange={(e) => handleInputChange(e)}
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
              onChange={(e) => handleInputChange(e)}
              placeholder="Last Name"
            />
          </div>
          <div className="form-input">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleInputChange(e)}
              placeholder="Email"
            />
          </div>
          <div className="form-input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => handleInputChange(e)}
              placeholder="Password"
            />
          </div>
          <div className="form-input">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => handleInputChange(e)}
              placeholder="Confirm Password"
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Register
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
          <Link to="/login">Login</Link>
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
      <RegistrationForm />
    </GoogleOAuthProvider>
  )
}

export default GoogleRegister
