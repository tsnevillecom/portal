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
import SignUp from '@routes/SignUp'
import Toasts from '@components/Toasts'
import Verify from '@routes/Verify'
import VerifyAccountEmail from '@routes/VerifyAccountEmail'
import ThemeToggle from '@components/ThemeToggle'
import ResetPasswordVerify from '@routes/ResetPasswordVerify'
import ResetPasswordEmail from '@routes/ResetPasswordEmail'
import AccountVerified from '@routes/AccountVerified'
import ExpiredLink from '@routes/ExpiredLink'

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<PersistLogin />}>
          <Route element={<UnauthenticatedLayout />}>
            <Route element={<UnauthenticatedRoute />}>
              <Route path="login" element={<Login />} />
              <Route path="sign-up" element={<SignUp />} />
              <Route path="verify" element={<VerifyAccountEmail />} />
              <Route path="verified" element={<AccountVerified />} />
              <Route path="expired/:link" element={<ExpiredLink />} />
              <Route path="verify/:token" element={<Verify />} />
              <Route path="reset-password" element={<ResetPasswordEmail />} />
              <Route
                path="reset-password/:token"
                element={<ResetPasswordVerify />}
              />
            </Route>
          </Route>

          {/* Protected Routes */}
          <Route element={<MainLayout />}>
            <Route element={<AuthenticatedRoute allowedRoles={[]} />}>
              <Route path="/" element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="unauthorized" element={<Unauthorized />} />
            </Route>

            <Route element={<AuthenticatedRoute allowedRoles={['admin']} />}>
              <Route path="admin" element={<Admin />} />
            </Route>
          </Route>
        </Route>

        <Route element={<UnauthenticatedLayout />}>
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
