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

type Disposable = { dispose: () => void }
type EventCallback = (event: Record<string, unknown>) => void

export type ISocketContext = {
  connected: boolean
  subscribe: (callback: EventCallback) => Disposable
  socket: Socket | null
}

export const SocketContext = createContext<ISocketContext>({
  connected: false,
  subscribe: () => ({ dispose: () => null }),
  socket: null,
})

const MAX_REFRESH_ATTEMPTS = 4

export const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { auth } = useAuth()
  const { addToast } = useContext(ToastContext)

  const refresh = useRefreshToken()
  const resetAttempts = useRef(0)

  const [connected, setConnected] = useState<boolean>(false)
  const [subscribed, setSubscribed] = useState<boolean>(false)
  const [subscriptions, setSubscriptions] = useState<Array<EventCallback>>([])
  const [socket, setSocket] = useState<Socket | null>(null)

  const subscriptionsRef = useRef(subscriptions)
  const socketRef = useRef<Socket | null>(null)
  const socketTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (socketTimerRef.current) clearTimeout(socketTimerRef.current)
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [])

  useEffect(() => {
    if (auth.accessToken && !socket) {
      connect()
    } else if (!auth.accessToken && socket) {
      disconnect('user logged out')
    }
  }, [auth.accessToken])

  useEffect(() => {
    if (connected && !subscribed) console.log('socket connected')
    if (subscribed) console.log('user subscribed')
  }, [connected, subscribed])

  useEffect(() => {
    socketRef.current = socket
  }, [socket])

  useEffect(() => {
    subscriptionsRef.current = subscriptions
  }, [subscriptions])

  const connect = () => {
    if (socketRef.current) return
    const socket = io('http://localhost:3333', {
      transports: ['websocket'],
      reconnection: false,
    })

    socket.on('connect', () => {
      setConnected(true)
      if (!subscribed) joinUser(socket)
      if (socketTimerRef.current) clearTimeout(socketTimerRef.current)
    })

    socket.on('connect_error', () => {
      console.log('connection failed')
      reconnect()
    })

    socket.on('disconnect', (reason) => disconnect(reason))

    socket.on('user_joined', ({ joined }) => {
      if (joined) {
        console.log('subscribing user')
        setSubscribed(true)
      } else {
        console.log('resetting socket')
        resetSocket()
      }
    })

    socket.on('message', (event) => {
      console.log(event)
      subscriptionsRef.current.forEach((callback) => callback(event))
    })

    socket.connect()
    setSocket(socket)
  }

  const joinUser = (socket: Socket) => {
    if (!auth.user) return
    socket.emit('join_server', { accessToken: auth.accessToken })
  }

  const resetSocket = async () => {
    if (socketRef.current) socketRef.current.disconnect()
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
    setSubscriptions([])

    if (reason === 'io client disconnect' || reason === 'user logged out') {
      setSubscribed(false)
      setSocket(null)
    } else {
      reconnect()
    }
  }

  const subscribe = (callback: EventCallback) => {
    setTimeout(() => {
      console.log('socket subscribed')
      setSubscriptions([...subscriptionsRef.current, callback])
    }, 0)

    const dispose = () => {
      console.log('socket disposed')
      const scrubbed = subscriptionsRef.current.filter((sub) => sub != callback)
      setSubscriptions(scrubbed)
    }
    return { dispose }
  }

  const contextValue = useMemo(
    () => ({
      connected,
      subscribe,
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

// HOW TO SUBSCRIBE

// const sub = subscribe((event: SocketEventData) => {
//     if (event.type === SOCKET_EVENT.msg) {
//       const activeChannelIds = _.map(activeChannelsRef.current, 'id')
//       if (!_.includes(activeChannelIds, event.data.channelId)) {
//         getChannels()
//       }
//     } else if (event.type === SOCKET_EVENT.channel) {
//       const channelId = event.data.channelId
//       setUpdateChannelConnection(channelId)
//       getChannels()
//     }
//   })

//   return () => sub.dispose()
