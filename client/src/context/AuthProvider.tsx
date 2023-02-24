import React, {
  createContext,
  useMemo,
  useState,
  PropsWithChildren,
} from 'react'
import { User } from '../_types/user'
import { useLocalStorage } from '../hooks/useLocalStorage'

type Auth = {
  accessToken: string | null
  user: User | null
  isAuthenticated: boolean
}

const noop = () => null

export const DEFAULT_AUTH_STATE = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
}

// export interface IAuthProvider extends PropsWithChildren {}

export interface IAuthContext {
  auth: Auth
  setAuth: (auth: Auth | ((auth: Auth) => Auth)) => void
  persist: boolean | null
  setPersist: (shouldPersist: boolean) => void
  isAdmin: boolean
}

export const AuthContext = createContext<IAuthContext>({
  auth: DEFAULT_AUTH_STATE,
  setAuth: noop,
  persist: true,
  setPersist: noop,
  isAdmin: false,
})

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [auth, setAuth] = useState<Auth>(DEFAULT_AUTH_STATE)
  const [persist, setPersist] = useLocalStorage<boolean>('persist', true)

  const isAdmin = useMemo(() => auth.user?.role === 'admin', [auth])

  const contextValue = useMemo(
    () => ({
      auth,
      setAuth,
      persist,
      setPersist,
      isAdmin,
    }),
    [auth, persist]
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
