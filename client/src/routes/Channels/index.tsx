import Button from '@components/Button'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import './Channels.scss'
import { Channel, User } from '@types'
import _ from 'lodash'
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import Page from '@components/Page'
import { classNames } from '@utils/classNames.util'
import { SocketContext } from '@context/SocketProvider'
import { AuthContext } from '@context/AuthProvider'
import { useNavigate, useParams } from 'react-router'
import ChatForm from '@components/ChatForm'
import Sidebar from '@components/Sidebar'

interface Message {
  body: string
  channelId: string
  createdBy: string
  updatedAt: string
  _id: string
}

interface Typing {
  isTyping: boolean
  userId: string
  channelId: string
  member: User
}

const Channels = () => {
  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()

  const { channel } = useParams<{ channel: string | undefined }>()
  const { auth } = useContext(AuthContext)
  const { socket } = useContext(SocketContext)

  const [isLoading, setIsLoading] = useState(true)
  const [channels, setChannels] = useState<Channel[]>([])
  const [typing, setTyping] = useState<User | null>(null)
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null)
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [openDetails, setOpenDetails] = useState(true)

  const chatThreadRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    init()
  }, [])

  const newMessageListener = useCallback(
    (message: Message) => {
      setMessages((previousMessages) => {
        const channelMessages = previousMessages[message.channelId] || []
        return {
          ...previousMessages,
          [message.channelId]: [...channelMessages, message],
        }
      })
    },
    [messages, activeChannel]
  )

  const channelTypingListener = useCallback(
    (channelTyping: Typing) => {
      if (channelTyping.channelId !== activeChannel?._id) return

      const member = activeChannel?.members.find(
        (memmber) => memmber._id === channelTyping.userId
      ) as User
      setTyping(channelTyping.isTyping ? member : null)
    },
    [activeChannel]
  )

  useEffect(() => {
    if (socket) socket.on('new_message', newMessageListener)

    return () => {
      if (socket) socket.off('new_message', newMessageListener)
    }
  }, [newMessageListener])

  useEffect(() => {
    if (socket) socket.on('channel_typing', channelTypingListener)

    return () => {
      if (socket) socket.off('channel_typing', channelTypingListener)
    }
  }, [channelTypingListener])

  useEffect(() => {
    if (channels.length) {
      const activeChannelId = channel || ''
      const match = _.find(channels, (cc) => cc._id === activeChannelId)
      setActiveChannel(match || channels[0])
    }
  }, [channels])

  useEffect(() => {
    if (chatThreadRef.current)
      chatThreadRef.current.scrollTo({
        left: 0,
        top: document.body.scrollHeight,
        behavior: 'smooth',
      })
  }, [messages])

  useEffect(() => {
    if (activeChannel) {
      const route = `/chat/${activeChannel._id}`
      navigate(route, { replace: true })
      getMessages(activeChannel)
    }
  }, [activeChannel])

  const init = async () => {
    try {
      const response = await axiosPrivate('/channels/member')
      setChannels(response.data)
    } catch (error) {
      console.log(error)
    }

    setIsLoading(false)
  }

  const getMessages = async (activeChannel: Channel) => {
    try {
      const response = await axiosPrivate(
        `/channels/${activeChannel._id}/messages`
      )
      setMessages((previousMessages) => {
        return {
          ...previousMessages,
          [activeChannel._id]: response.data,
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const renderBody = (body: string) => {
    return body.replace(
      // eslint-disable-next-line no-control-regex
      new RegExp('\r?\n', 'g'),
      '<br>'
    )
  }

  return (
    <Page id="chat" flex={true} isLoading={isLoading}>
      <Sidebar id="chat-channels" side="left">
        <div id="chat-channels-header">
          <h4>Channels</h4>
          <Button>+</Button>
        </div>

        {_.map(channels, (channel, i) => {
          const cx = {
            'chat-channel': true,
            active: !!activeChannel && channel._id === activeChannel._id,
          }

          const classes = classNames(cx)

          return (
            <div
              className={classes}
              key={i}
              onClick={() => setActiveChannel(channel)}
            >
              {channel.name}
            </div>
          )
        })}
      </Sidebar>

      {activeChannel && (
        <div id="chat-channel">
          <div id="chat-channel-header">{activeChannel.name}</div>
          <div id="chat-channel-thread" ref={chatThreadRef}>
            <div id="chat-channel-messages">
              {activeChannel &&
                messages[activeChannel._id] &&
                messages[activeChannel._id].map((message) => {
                  const cx = {
                    'chat-channel-message': true,
                    sender: auth.user?._id === message.createdBy,
                    receiver: auth.user?._id !== message.createdBy,
                  }

                  const classes = classNames(cx)

                  return (
                    <div
                      key={message._id}
                      onClick={() => setOpenDetails(!openDetails)}
                      className={classes}
                      dangerouslySetInnerHTML={{
                        __html: renderBody(message.body),
                      }}
                    />
                  )
                })}
            </div>
          </div>

          {typing && (
            <div id="chat-channel-typing">
              {`${typing.firstName} ${typing.lastName}`} is typing
            </div>
          )}

          <ChatForm activeChannel={activeChannel} ref={messageRef} />
        </div>
      )}

      <Sidebar id="chat-sidebar" side="right" open={openDetails} width={300}>
        <h5>Details</h5>
      </Sidebar>
    </Page>
  )
}

export default Channels
