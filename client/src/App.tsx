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

const ROLES = {
  User: 2001,
  Editor: 1984,
  Admin: 5150,
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* we want to protect these routes */}
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

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  )
}

export default App
