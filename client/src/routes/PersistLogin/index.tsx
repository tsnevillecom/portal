import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useRefreshToken from '@hooks/useRefreshToken'
import useAuth from '@hooks/useAuth'

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefreshToken()
  const { auth, persist } = useAuth()

  let ignore = false

  useEffect(() => {
    const verifyRefreshToken = async () => {
      if (ignore) return
      ignore = true

      try {
        await refresh()
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    // Avoids unwanted call to verifyRefreshToken
    !auth.accessToken && persist ? verifyRefreshToken() : setIsLoading(false)
  }, [])

  if (persist && isLoading) {
    return <p>Loading...</p>
  }

  return <Outlet />
}

export default PersistLogin
