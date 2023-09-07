import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'

import Login from '@routes/Login'
import Missing from '@routes/Missing'
import Home from '@routes/Home'
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
import ResetPasswordVerify from '@routes/ResetPasswordVerify'
import ResetPasswordEmail from '@routes/ResetPasswordEmail'
import AccountVerified from '@routes/AccountVerified'
import ExpiredLink from '@routes/ExpiredLink'
import Chat from '@routes/Chat'
import useTheme from '@hooks/useTheme'
import AdminChatChannels from '@routes/AdminChatChannels'
import AdminUsers from '@routes/AdminUsers'
import AdminCompanies from '@routes/AdminCompanies'
import AdminCompany from '@routes/AdminCompany'
import ModalRoot from './modals/ModalRoot'
import AdminLocations from '@routes/AdminLocations'
import AdminLocation from '@routes/AdminLocation'
import { CompanyProvider } from '@context/CompanyProvider'
import AdminOrgs from '@routes/AdminOrgs'
import AdminSettings from '@routes/AdminSettings'

const App = () => {
  useTheme()

  return (
    <>
      <ModalRoot />
      <Toasts />

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
              <Route path="chat" element={<Chat />} />
              <Route path="chat/:channel" element={<Chat />} />
              <Route path="unauthorized" element={<Unauthorized />} />
            </Route>

            <Route
              path="admin"
              element={
                <AuthenticatedRoute allowedRoles={['admin', 'super-admin']} />
              }
            >
              <Route path="users" element={<AdminUsers />} />

              <Route
                element={
                  <CompanyProvider>
                    <Outlet />
                  </CompanyProvider>
                }
              >
                <Route path="companies" element={<AdminCompanies />} />
                <Route path="companies/:companyId" element={<AdminCompany />}>
                  <Route path="" element={<AdminLocations />} />
                </Route>
                <Route
                  path="companies/:companyId/locations/:locationId"
                  element={<AdminLocation />}
                />
              </Route>
              <Route path="chat-channels" element={<AdminChatChannels />} />
              <Route path="orgs" element={<AdminOrgs />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Route>

        <Route element={<UnauthenticatedLayout />}>
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
