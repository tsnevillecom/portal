import { axiosPrivate } from '../api/axios'
import { DEFAULT_AUTH_STATE } from '../context/AuthProvider'
import useAuth from './useAuth'

const useLogout = () => {
  const { setAuth } = useAuth()

  const logout = async () => {
    setAuth(DEFAULT_AUTH_STATE)

    try {
      await axiosPrivate.post('/auth/logout')
    } catch (err) {
      console.error(err)
    }
  }

  return logout
}

export default useLogout
