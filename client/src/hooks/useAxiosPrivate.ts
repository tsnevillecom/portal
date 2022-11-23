import { axiosPrivate } from '../api/axios'
import { useEffect } from 'react'
import useRefreshToken from './useRefreshToken'
import useAuth from './useAuth'
import { AxiosError } from 'axios'

type Headers = {
  [key: string]: string | number | null
}

type FailedResponseQueueType = {
  resolve: (value: unknown) => void
  reject: (reason?: any) => void
}

const useAxiosPrivate = () => {
  const refresh = useRefreshToken()
  const { auth } = useAuth()

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (config.headers && !config.headers['Authorization']) {
          const authorizationHeader = {
            Authorization: `Bearer ${auth?.accessToken}`,
          }

          config.headers = { ...config.headers, ...authorizationHeader }
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    let isRefreshingToken = false
    let failedResponseQueue: FailedResponseQueueType[] = []

    const processQueue = (error: AxiosError | null, token = null) => {
      failedResponseQueue.forEach(({ resolve, reject }) => {
        if (error) {
          reject(error)
        } else {
          resolve(token)
        }
      })

      failedResponseQueue = []
    }

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          if (isRefreshingToken) {
            return new Promise(function (resolve, reject) {
              failedResponseQueue.push({ resolve, reject })
            })
              .then((token) => {
                const authorizationHeader = {
                  Authorization: `Bearer ${token}`,
                }

                prevRequest.headers = {
                  ...prevRequest.headers,
                  ...authorizationHeader,
                }
                return axiosPrivate(prevRequest)
              })
              .catch((err) => {
                return Promise.reject(err)
              })
          }

          prevRequest.sent = true
          isRefreshingToken = true

          return new Promise(function (resolve, reject) {
            refresh()
              .then((accessToken) => {
                const authorizationHeader = {
                  Authorization: `Bearer ${accessToken}`,
                }
                prevRequest.headers = {
                  ...prevRequest.headers,
                  ...authorizationHeader,
                }

                processQueue(null, accessToken)
                resolve(axiosPrivate(prevRequest))
                console.log('access token refreshed')
              })
              .catch((err) => {
                processQueue(err, null)
                reject(err)
              })
              .finally(() => {
                isRefreshingToken = false
              })
          })
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
  }, [auth, refresh])

  return axiosPrivate
}

export default useAxiosPrivate
