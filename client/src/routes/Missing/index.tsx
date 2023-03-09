import React from 'react'
import { Link } from 'react-router-dom'
import './Missing.scss'

const Missing = () => {
  return (
    <section id="missing-route">
      <div>
        <h1>Oops!</h1>
        <h3>Page Not Found</h3>
        <p>The page you are looking for does not exist.</p>
        <Link to="/">Home</Link>
      </div>
    </section>
  )
}

export default Missing
