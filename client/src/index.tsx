import React from 'react'
import './index.scss'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import App from './App'
import { ToastProvider } from './context/ToastContext'
import { SocketProvider } from '@context/SocketProvider'
import { ModalProvider } from '@context/ModalProvider'
import { ResponsiveProvider } from '@farfetch/react-context-responsive'
import CONSTANTS from './_constants'

const container = document.getElementById('root')
const root = createRoot(container as Element)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <ModalProvider>
          <AuthProvider>
            <SocketProvider>
              <ResponsiveProvider
                breakpoints={CONSTANTS.BREAKPOINTS}
                breakpointsMax={CONSTANTS.BREAKPOINTS_MAX}
                mobileBreakpoint="sm"
              >
                <Routes>
                  <Route path="/*" element={<App />} />
                </Routes>
              </ResponsiveProvider>
            </SocketProvider>
          </AuthProvider>
        </ModalProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
)

//remove StrictMode
// root.render(
//   <BrowserRouter>
//     <ToastProvider>
//       <ModalProvider>
//         <AuthProvider>
//           <SocketProvider>
//             <ResponsiveProvider
//               breakpoints={CONSTANTS.BREAKPOINTS}
//               breakpointsMax={CONSTANTS.BREAKPOINTS_MAX}
//               mobileBreakpoint="sm"
//             >
//               <Routes>
//                 <Route path="/*" element={<App />} />
//               </Routes>
//             </ResponsiveProvider>
//           </SocketProvider>
//         </AuthProvider>
//       </ModalProvider>
//     </ToastProvider>
//   </BrowserRouter>
// )
