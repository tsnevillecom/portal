import React from 'react'
import { Link } from 'react-router-dom'

const Unauthorized = () => {
  return (
    <section id="unauthorized-route">
      <h1>Unauthorized</h1>
      <p>You do not have access to the requested page.</p>
      <Link to="/">Home</Link>
    </section>
  )
}

export default Unauthorized
