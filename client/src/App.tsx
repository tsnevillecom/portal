import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Login from './routes/Login'
import Missing from './routes/Missing'
import Home from './routes/Home'
import Admin from './routes/Admin'
import Profile from './routes/Profile'

import Layout from './components/Layout'
import Unauthorized from './components/Unauthorized'
import RequireAuth from './components/RequireAuth'
import PersistLogin from './components/PersistLogin'
import Register from './routes/Register'
import Toasts from './components/Toasts'

const ROLES = {
  User: 2001,
  Editor: 1984,
  Admin: 5150,
}

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="unauthorized" element={<Unauthorized />} />

          {/* Protected Routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={[]} />}>
              <Route path="/" element={<Home />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[]} />}>
              <Route path="admin" element={<Admin />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[]} />}>
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>

      <Toasts />
    </>
  )
}

export default App
