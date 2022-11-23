import React, {
  createContext,
  useMemo,
  useState,
  PropsWithChildren,
} from 'react'
import { User } from '../_types/user'
import { useLocalStorage } from '../hooks/useLocalStorage'

type Auth = {
  email: string | null
  accessToken: string | null
  user: User | null
  isAuthenticated: boolean
}

const noop = () => null

export const DEFAULT_AUTH_STATE = {
  email: null,
  accessToken: null,
  user: null,
  isAuthenticated: false,
}

export interface IAuthProvider extends PropsWithChildren {}

export interface IAuthContext {
  auth: Auth
  setAuth: (auth: Auth | ((auth: Auth) => Auth)) => void
  persist: boolean | null
  setPersist: (shouldPersist: boolean) => void
}

export const AuthContext = createContext<IAuthContext>({
  auth: DEFAULT_AUTH_STATE,
  setAuth: noop,
  persist: true,
  setPersist: noop,
})

export const AuthProvider: React.FC<IAuthProvider> = ({ children }) => {
  const [auth, setAuth] = useState<Auth>(DEFAULT_AUTH_STATE)
  const [persist, setPersist] = useLocalStorage<boolean>('persist', true)

  const contextValue = useMemo(
    () => ({
      auth,
      setAuth,
      persist,
      setPersist,
    }),
    [auth, persist]
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
