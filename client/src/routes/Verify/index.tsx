import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import './Verify.scss'
import axios from 'src/api/axios'

const Verify = () => {
  const params = useParams()
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    verify()
  }, [])

  const verify = async () => {
    try {
      if (params.token) {
        await axios.get(`/verify/${params.token}`)
      } else {
        setHasError(true)
      }
    } catch (error) {
      console.log(error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return null

  return (
    <section id="verify-route">
      <div className="floating">
        <h1>Verify</h1>
        {hasError ? <p>You are not verified</p> : <p>You are verified</p>}
        <Link to="/">Home</Link>
      </div>
    </section>
  )
}

export default Verify
