import Button from '@components/Button'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import './Channels.scss'
import { Channel } from '@types'
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

interface Message {
  body: string
  channelId: string
  createdBy: string
  updatedAt: string
  _id: string
}

const Channels = () => {
  const navigate = useNavigate()
  const { channel } = useParams<{ channel: string | undefined }>()
  const { auth } = useContext(AuthContext)
  const { socket } = useContext(SocketContext)

  const axiosPrivate = useAxiosPrivate()

  const [isLoading, setIsLoading] = useState(true)
  const [channels, setChannels] = useState<Channel[]>([])
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null)
  const [messages, setMessages] = useState<Record<string, Message[]>>({})

  const chatThreadRef = useRef<HTMLDivElement>(null)
  const activeChannelRef = useRef<Channel | null>(null)

  useEffect(() => {
    init()
  }, [])

  const listener = useCallback(
    (message: Message) => {
      if (!activeChannel) return

      setMessages((previousMessages) => {
        const channelMessages = previousMessages[activeChannel._id] || []

        return {
          ...previousMessages,
          [activeChannel._id]: [...channelMessages, message],
        }
      })
    },
    [messages, activeChannel]
  )

  useEffect(() => {
    if (socket) socket.on('new_message', listener)

    return () => {
      if (socket) socket.off('new_message', listener)
    }
  }, [listener])

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
    activeChannelRef.current = activeChannel
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
      {activeChannel && (
        <div id="chat-channel">
          <div id="chat-channel-header">{activeChannel.name}</div>
          <div id="chat-channel-thread" ref={chatThreadRef}>
            <div id="chat-channel-messages">
              {activeChannel &&
                messages[activeChannel._id] &&
                messages[activeChannel._id].map((m, i) => {
                  const cx = {
                    'chat-channel-message': true,
                    sender: auth.user?._id === m.createdBy,
                    receiver: auth.user?._id !== m.createdBy,
                  }

                  const classes = classNames(cx)

                  return (
                    <div
                      key={i}
                      className={classes}
                      dangerouslySetInnerHTML={{ __html: renderBody(m.body) }}
                    />
                  )
                })}
            </div>
          </div>

          <ChatForm channel={activeChannel} />
        </div>
      )}

      <div id="chat-channels">
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
      </div>
    </Page>
  )
}

export default Channels
