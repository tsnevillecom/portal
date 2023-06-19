import Button from '@components/Button'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import './Channels.scss'
import { Channel } from '@types'
import _ from 'lodash'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Page from '@components/Page'
import { classNames } from '@utils/classNames.util'
import FormControl from '@components/FormControl'
import { SocketContext } from '@context/SocketProvider'

const Channels = () => {
  const { socket } = useContext(SocketContext)
  const axiosPrivate = useAxiosPrivate()
  const [isLoading, setIsLoading] = useState(true)
  const [channels, setChannels] = useState<Channel[]>([])
  const [activeChannel, setActiveChannel] = useState<Channel>()
  const [message, setMessage] = useState<string>('')

  const messageRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    setActiveChannel(activeChannel || channels[0])
  }, [channels])

  const init = async () => {
    try {
      const response = await axiosPrivate('/channels/member')
      setChannels(response.data)
    } catch (error) {
      console.log(error)
    }

    setIsLoading(false)
  }

  const sendMessage = () => {
    if (socket)
      socket.emit(
        'send_message',
        {
          message,
          channel: activeChannel?._id,
        },
        (response: any) => console.log(response)
      )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    switch (name) {
      case 'message':
        setMessage(value)
        break
    }
  }

  if (isLoading) return null

  return (
    <Page id="chat" flex={true}>
      {activeChannel && (
        <div id="chat-channel">
          <div id="chat-channel-header">{activeChannel.name}</div>
          <div id="chat-channel-thread"></div>
          <div id="chat-channel-control">
            <FormControl
              forRef={messageRef}
              name="message"
              value={message}
              textarea
              onChange={handleInputChange}
            />

            <Button onClick={sendMessage}>Send</Button>
          </div>
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
            active: activeChannel && channel._id === activeChannel._id,
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
