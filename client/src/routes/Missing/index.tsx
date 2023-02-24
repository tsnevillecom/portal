import React from 'react'
import { Link } from 'react-router-dom'

const Missing = () => {
  return (
    <section id="missing-route">
      <h1>Oops!</h1>
      <p>Page Not Found</p>
      <Link to="/">Home</Link>
    </section>
  )
}

export default Missing
