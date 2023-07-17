import axios from 'axios'

export const getBaseUrl = (version = 1) =>
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_API_URL + `/v${version}`
    : process.env.REACT_APP_DEV_API_URL + '/v1'

export default axios.create({
  baseURL: getBaseUrl(),
})

export const axiosPrivate = axios.create({
  baseURL: getBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})
