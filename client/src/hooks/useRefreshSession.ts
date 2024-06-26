import axios from '../api/axios'
import useAuth from './useAuth'

const useRefreshSession = () => {
  const { setAuth } = useAuth()

  const refresh = async () => {
    const response = await axios.get('/auth/refresh', {
      withCredentials: true,
    })

    setAuth((prev) => {
      return {
        ...prev,
        user: response.data.user,
        accessToken: response.data.accessToken,
        isAuthenticated: true,
      }
    })

    return response.data.accessToken
  }

  return { refresh }
}

export default useRefreshSession
