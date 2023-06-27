import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import './Profile.scss'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import useLogout from '@hooks/useLogout'
import useRefreshSession from '@hooks/useRefreshSession'
import Page from '@components/Page'
import { ToastContext } from '@context/ToastContext'

const Profile = () => {
  const axiosPrivate = useAxiosPrivate()
  const { logoutall } = useLogout()
  const { refresh } = useRefreshSession()
  const { addToast } = useContext(ToastContext)

  const getMe = async () => {
    try {
      const response = await axiosPrivate('/auth/me')
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const checkSession = async () => {
    try {
      await axiosPrivate('/auth/checkSession')
      console.log('✅ session active')
    } catch (error) {
      console.log(error, '❌ session active')
    }
  }

  const refreshSession = async () => {
    try {
      await refresh()
      console.log('✅ session refreshed')
    } catch (error) {
      console.log(error, '❌ session not refreshed')
    }
  }

  return (
    <Page id="profile-route">
      <h1>Profile</h1>
      <a onClick={getMe}>Me</a>
      <a onClick={checkSession}>Check Token</a>
      <a onClick={logoutall}>Logout All</a>
      <a onClick={refreshSession}>Refresh</a>
      <a onClick={() => addToast('test', 'danger')}>Add toast</a>
      <div className="flexGrow">
        <Link to="/">Home</Link>
      </div>
    </Page>
  )
}

export default Profile
