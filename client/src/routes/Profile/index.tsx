import React from 'react'
import { Link } from 'react-router-dom'
import './Profile.scss'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import useLogout from '@hooks/useLogout'
import useRefreshToken from '@hooks/useRefreshToken'
import Page from '@components/Page'

const Profile = () => {
  const axiosPrivate = useAxiosPrivate()
  const { logoutall } = useLogout()
  const { refresh } = useRefreshToken()

  const getMe = async () => {
    try {
      await axiosPrivate('/auth/me')
    } catch (error) {
      console.log(error)
    }
  }

  const checktoken = async () => {
    try {
      await axiosPrivate('/auth/checktoken')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Page id="profile-route">
      <h1>Profile</h1>

      <a onClick={getMe}>Me</a>

      <a onClick={checktoken}>Check Token</a>

      <a onClick={logoutall}>Logout All</a>

      <a onClick={refresh}>Refresh</a>

      <div className="flexGrow">
        <Link to="/">Home</Link>
      </div>
    </Page>
  )
}

export default Profile
