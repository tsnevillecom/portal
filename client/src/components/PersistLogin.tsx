import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from '../hooks/useAuth'
import CONSTANTS from '../_constants'

console.log('PersistLogin')

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefreshToken()
  const { auth, persist } = useAuth()

  useEffect(() => {
    let isMounted = true

    const verifyRefreshToken = async () => {
      console.log('verifyRefreshToken')

      try {
        await refresh()
      } catch (err) {
        console.error(err)
      } finally {
        isMounted && setIsLoading(false)
      }
    }

    // const checkExpiration = () => {
    //   if (!refreshToken) return { expiring: false, expired: true }
    //   const now = new Date()
    //   const expiry = refreshToken.expiry
    //   const ttl = expiry - now.getTime()
    //   const alertTime = expiry - CONSTANTS.SESSION_TIMEOUT_ALERT
    //   const expiring = now.getTime() < expiry && now.getTime() >= alertTime
    //   const expired = now.getTime() > expiry
    //   return { expiring, expired, ttl }
    // }

    // Avoids unwanted call to verifyRefreshToken
    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false)

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>{!persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
  )
}

export default PersistLogin
