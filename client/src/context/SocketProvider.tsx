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
import useRefreshToken from '@hooks/useRefreshToken'
import { ToastContext } from './ToastContext'

export type ISocketContext = {
  connected: boolean
  socket: Socket | null
}

export const SocketContext = createContext<ISocketContext>({
  connected: false,
  socket: null,
})

const MAX_REFRESH_ATTEMPTS = 4

export const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { auth } = useAuth()
  const { addToast } = useContext(ToastContext)

  const { refresh } = useRefreshToken()
  const resetAttempts = useRef(0)

  const [connected, setConnected] = useState<boolean>(false)
  const [subscribed, setSubscribed] = useState<boolean>(false)
  const [socket, setSocket] = useState<Socket | null>(null)

  const socketRef = useRef<Socket | null>(null)
  const socketTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (socketTimerRef.current) clearTimeout(socketTimerRef.current)
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

    const socket = io('http://localhost:3333', {
      transports: ['websocket'],
      reconnection: false,
    })

    socket.on('connect', () => {
      setConnected(true)
      if (!subscribed) joinChannels(socket)
      if (socketTimerRef.current) clearTimeout(socketTimerRef.current)
    })

    socket.on('connect_error', () => {
      console.log('connection failed')
      reconnect()
    })

    socket.on('disconnect', (reason) => disconnect(reason))

    socket.on('user_joined', ({ joined }) => {
      if (joined) {
        console.log('subscribing user to channels')
        setSubscribed(true)
      } else {
        console.log('socket resetting')
        setTimeout(() => resetSocket(), 2000)
      }
    })

    socket.connect()
    setSocket(socket)
  }

  const joinChannels = (socket: Socket) => {
    if (!auth.user) return
    socket.emit('join_channels', { accessToken: auth.accessToken })
  }

  const resetSocket = async () => {
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
      addToast('Could not establish socket connection')
      resetAttempts.current = 0
    }
  }

  const reconnect = () => {
    socketTimerRef.current = setTimeout(() => {
      console.log('attempting to reconnect')
      socketRef.current?.connect()
    }, 3000)
  }

  const disconnect = (reason?: string) => {
    console.log('socket disconnected:', reason)
    setConnected(false)

    if (reason === 'io client disconnect') {
      setSubscribed(false)
      setSocket(null)
    } else {
      reconnect()
    }
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
