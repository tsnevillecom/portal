import { axiosPrivate } from '../api/axios'
import { DEFAULT_AUTH_STATE } from '../context/AuthProvider'
import useAuth from './useAuth'

const useLogout = () => {
  const { setAuth } = useAuth()

  const logout = async () => {
    try {
      await axiosPrivate.post('/auth/logout')
      setAuth(DEFAULT_AUTH_STATE)
    } catch (err) {
      console.error(err)
    }
  }

  const logoutall = async () => {
    try {
      await axiosPrivate.post('/auth/logoutall')
      setAuth(DEFAULT_AUTH_STATE)
    } catch (err) {
      console.error(err)
    }
  }

  return { logout, logoutall }
}

export default useLogout
