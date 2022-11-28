import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthProvider'
import { GoogleOAuthProvider } from '@react-oauth/google'

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
      >
        <AuthProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
