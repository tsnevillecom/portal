import React, { useState } from 'react'
import './Register.scss'

function RegistrationForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [domain, setDomain] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

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
      case 'domain':
        setDomain(value)
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

  return (
    <div id="register-route">
      <section className="floating">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-input">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => handleInputChange(e)}
              id="firstName"
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
              placeholder="LastName"
            />
          </div>
          <div className="form-input">
            <label htmlFor="domain">Domain</label>
            <input
              type="text"
              name=""
              id="domain"
              value={domain}
              onChange={(e) => handleInputChange(e)}
              placeholder="Domain"
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

          <button type="submit">Register</button>
        </form>
      </section>
    </div>
  )
}

export default RegistrationForm
