import React, {
  createContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  PropsWithChildren,
  useContext,
} from 'react'
import { io, Socket } from 'socket.io-client'
import useAuth from '@hooks/useAuth'
import useRefreshSession from '@hooks/useRefreshSession'
import { ToastContext } from './ToastContext'

const WS_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_WS_SECURE
    : process.env.REACT_APP_WS

export type ISocketContext = {
  connected: boolean
  socket: Socket | null
}

export const SocketContext = createContext<ISocketContext>({
  connected: false,
  socket: null,
})

const MAX_REFRESH_ATTEMPTS = 1

export const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { auth } = useAuth()
  const { addToast } = useContext(ToastContext)

  const { refresh } = useRefreshSession()
  const resetAttempts = useRef(0)

  const [connected, setConnected] = useState<boolean>(false)
  const [subscribed, setSubscribed] = useState<boolean>(false)
  const [socket, setSocket] = useState<Socket | null>(null)

  const socketRef = useRef<Socket | null>(null)
  const socketResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (socketResetTimerRef.current) clearTimeout(socketResetTimerRef.current)
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [])

  useEffect(() => {
    if (auth.accessToken && !socketRef.current) {
      connect()
    } else if (!auth.accessToken && socketRef.current) {
      socketRef.current.disconnect()
    }
  }, [auth.accessToken])

  useEffect(() => {
    if (connected && !subscribed) console.log('socket connected')
    if (subscribed) console.log('user subscribed')
  }, [connected, subscribed])

  useEffect(() => {
    socketRef.current = socket
  }, [socket])

  const connect = () => {
    if (socketRef.current) return

    const socket = io(WS_URL as string, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      autoConnect: false,
    })

    socket.on('connect', () => {
      setConnected(true)
      if (!subscribed) joinChannels(socket)
    })

    socket.on('connect_error', () => {
      console.log('connection failed')
      addToast('Attempting to establish a socket connection.')
    })

    socket.io.on('error', (error) => {
      console.log('error:', error.message)
    })

    socket.on('disconnect', (reason) => disconnect(reason))

    socket.io.on('reconnect', (attempt) => {
      addToast(
        `Socket reconnected after ${attempt} attempt(s).`,
        'success',
        true,
        5000
      )
    })

    socket.io.on('reconnect_attempt', (attempt) => {
      console.log('attempting to reconnect socket:', attempt)
    })

    socket.io.on('reconnect_error', (error) => {
      console.log('socket reconnect error:', error.message)
    })

    socket.io.on('reconnect_failed', () => {
      console.log('reconnect failed')
      addToast('Could not establish socket connection. Try reloading the page.')
    })

    socket.on('user_joined', ({ joined }) => {
      if (joined) {
        console.log('subscribing user to channels')
        setSubscribed(true)
      } else {
        console.log('refreshing socket session')
        socketResetTimerRef.current = setTimeout(
          () => refreshSocketSession(),
          2000
        )
      }
    })

    socket.connect()
    setSocket(socket)
  }

  const joinChannels = (socket: Socket) => {
    if (!auth.user) return
    socket.emit('join_channels')
  }

  const refreshSocketSession = async () => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
    resetAttempts.current++
    setConnected(false)
    setSubscribed(false)
    setSocket(null)

    if (resetAttempts.current <= MAX_REFRESH_ATTEMPTS) {
      refresh()
    } else {
      addToast('Could not establish socket connection. Try reloading the page.')
      resetAttempts.current = 0
    }
  }

  const disconnect = (reason?: string) => {
    console.log('socket disconnected:', reason)
    setConnected(false)
    setSubscribed(false)
    setSocket(null)
  }

  const contextValue = useMemo(
    () => ({
      connected,
      subscribed,
      socket,
    }),
    [connected, subscribed, socket]
  )

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  )
}
