import React from 'react'
import { Link } from 'react-router-dom'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const Admin = () => {
  const axiosPrivate = useAxiosPrivate()

  const getMe = async () => {
    try {
      await axiosPrivate('/auth/me')
    } catch (error) {
      // console.log(error)
    }
  }

  const checktoken = async () => {
    try {
      await axiosPrivate('/auth/checktoken')
    } catch (error) {
      // console.log(error)
    }
  }

  return (
    <section>
      <h1>Admin Page</h1>
      <br />

      <a onClick={getMe}>Me</a>
      <a onClick={checktoken}>Check</a>
      <br />
      <div className="flexGrow">
        <Link to="/">Home</Link>
      </div>
    </section>
  )
}

export default Admin
