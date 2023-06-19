import axios from '../api/axios'
import useAuth from './useAuth'

const useRefreshToken = () => {
  const { setAuth } = useAuth()

  const refresh = async () => {
    try {
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
    } catch (error) {
      console.log(error)
    }
  }

  return { refresh }
}

export default useRefreshToken
