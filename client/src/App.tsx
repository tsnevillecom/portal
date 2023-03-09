import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Login from '@routes/Login'
import Missing from '@routes/Missing'
import Home from '@routes/Home'
import Admin from '@routes/Admin'
import Profile from '@routes/Profile'

import MainLayout from './layouts/Main.layout'
import UnauthenticatedLayout from './layouts/Unauthenticated.layout'
import Unauthorized from '@routes/Unauthorized'
import UnauthenticatedRoute from '@routes/UnauthenticatedRoute'
import AuthenticatedRoute from '@routes/AuthenticatedRoute'
import PersistLogin from '@routes/PersistLogin'
import Register from '@routes/Register'
import Toasts from '@components/Toasts'
import useAuth from './hooks/useAuth'
import Verify from '@routes/Verify'
import ThemeToggle from '@components/ThemeToggle'
import ResetPassword from '@routes/ResetPassword'
import EmailSent from '@routes/EmailSent'

const App = () => {
  const { auth } = useAuth()

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            auth.user && auth.isAuthenticated ? (
              <MainLayout />
            ) : (
              <UnauthenticatedLayout />
            )
          }
        >
          <Route element={<UnauthenticatedRoute />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="verify/:token" element={<Verify />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="email-sent" element={<EmailSent />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<PersistLogin />}>
            <Route element={<AuthenticatedRoute allowedRoles={[]} />}>
              <Route path="/" element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="unauthorized" element={<Unauthorized />} />
            </Route>

            <Route element={<AuthenticatedRoute allowedRoles={['admin']} />}>
              <Route path="admin" element={<Admin />} />
            </Route>
          </Route>

          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>

      <ThemeToggle />

      <Toasts />
    </>
  )
}

export default App
