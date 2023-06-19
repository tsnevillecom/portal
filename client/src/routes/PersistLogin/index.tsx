import React, { useState, useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import useRefreshToken from '@hooks/useRefreshToken'
import useAuth from '@hooks/useAuth'
import Spinner from '@components/Spinner'
import _ from 'lodash'

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { refresh } = useRefreshToken()
  const { auth, persist } = useAuth()
  const ignoreRef = useRef(false)

  useEffect(() => {
    const debounceLoadingFalse = _.debounce(() => setIsLoading(false), 500)

    const verifyRefreshToken = async () => {
      if (ignoreRef.current) return
      ignoreRef.current = true

      try {
        await refresh()
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('No refresh token. Login.')
        } else {
          console.error(error)
        }
      } finally {
        debounceLoadingFalse()
      }
    }

    // Avoids unwanted call to verifyRefreshToken
    !auth.accessToken && persist ? verifyRefreshToken() : debounceLoadingFalse()
  }, [])

  if (persist && isLoading) return <Spinner />

  return <Outlet />
}

export default PersistLogin
