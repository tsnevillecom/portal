import React from 'react'
import './index.scss'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import App from './App'
import { ToastProvider } from './context/ToastContext'
import { SocketProvider } from '@context/SocketProvider'

const container = document.getElementById('root')
const root = createRoot(container as Element)
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <ToastProvider>
//         <AuthProvider>
//           <Routes>
//             <Route path="/*" element={<App />} />
//           </Routes>
//         </AuthProvider>
//       </ToastProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// )

//remove StrictMode
root.render(
  <BrowserRouter>
    <ToastProvider>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </ToastProvider>
  </BrowserRouter>
)
