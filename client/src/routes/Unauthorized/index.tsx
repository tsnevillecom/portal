import React from 'react'
import { Link } from 'react-router-dom'
import './Unauthorized.scss'

const Unauthorized = () => {
  return (
    <section id="unauthorized-route">
      <div>
        <h1>Unauthorized</h1>
        <p>You do not have access to the requested page.</p>
        <Link to="/">Home</Link>
      </div>
    </section>
  )
}

export default Unauthorized
