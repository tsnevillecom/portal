import React, {
  useContext,
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react'
import './ChatForm.scss'
import { GrSend } from 'react-icons/gr'
import { Channel } from '@types'
import Button from '@components/Button'
import { SocketContext } from '@context/SocketProvider'
import TextareaAutosize from 'react-textarea-autosize'
import _ from 'lodash'
import { AuthContext } from '@context/AuthProvider'

interface ChatFormProps {
  channel: Channel
}

interface SendMessageEmitResponse {
  message: Message
  status: string
}

interface Message {
  body: string
  channelId: string
  createdBy: string
  updatedAt: string
  _id: string
}

const ChatForm: React.FC<ChatFormProps> = ({ channel }) => {
  const { socket } = useContext(SocketContext)
  const { auth } = useContext(AuthContext)

  const [disabledSubmit, setDisabledSubmit] = useState(true)

  const channelIdRef = useRef(channel._id)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.focus()
      messageRef.current.addEventListener('keydown', _handleKeyDown)
    }

    return () => {
      if (messageRef.current)
        messageRef.current.removeEventListener('keydown', _handleKeyDown)
    }
  }, [messageRef])

  useEffect(() => {
    clearInput()
    channelIdRef.current = channel._id
  }, [channel])

  const _handleKeyDown = (event: KeyboardEvent) => {
    //if in IME compose mode (japanese, etc)
    if (event.key === 'Enter' && event.isComposing) return
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSendMessage(event)
    }
  }

  const clearInput = () => {
    if (messageRef.current) {
      messageRef.current.value = ''
      messageRef.current.focus()
      setDisabledSubmit(true)
    }
  }

  const handleSendMessage = (
    e?: React.MouseEvent<HTMLElement> | KeyboardEvent
  ) => {
    setTypingOn.cancel()
    setTypingOff.flush()

    e?.preventDefault()
    const body = (messageRef.current as HTMLTextAreaElement).value
    if (!body) return

    if (socket) {
      socket.emit(
        'send_message',
        {
          body: body,
          channelId: channelIdRef.current,
        },
        (response: SendMessageEmitResponse) => {
          console.log(response)
          clearInput()
        }
      )
    }
  }

  const setTypingOn = _.debounce(
    () => {
      if (socket)
        socket.emit('typing', {
          isTyping: true,
          userId: auth.user?._id,
          channelId: channelIdRef.current,
        })
    },
    2000,
    { leading: true, trailing: false }
  )

  const setTypingOff = _.debounce(
    () => {
      if (socket)
        socket.emit('typing', {
          isTyping: false,
          userId: auth.user?._id,
          channelId: channelIdRef.current,
        })
    },
    2000,
    { leading: false, trailing: true }
  )

  const debounceSetTypingOn = useCallback(setTypingOn, [])
  const debounceSetTypingOff = useCallback(setTypingOff, [])

  const typingHandler = (event: React.FormEvent<HTMLTextAreaElement>) => {
    if (disabledSubmit && !!event.currentTarget.value) {
      setDisabledSubmit(false)
    } else if (!disabledSubmit && !event.currentTarget.value) {
      setDisabledSubmit(true)
    }

    debounceSetTypingOn()
    debounceSetTypingOff()
  }
  const submit = () => {
    const keyboardEvent = new KeyboardEvent('keydown', {
      code: 'Enter',
      key: 'Enter',
      charCode: 13,
      keyCode: 13,
      view: window,
      bubbles: true,
    })
    messageRef.current?.dispatchEvent(keyboardEvent)
  }

  return (
    <div id="chat-channel-control">
      <div className="chat-form--input form-control">
        <TextareaAutosize
          maxRows={4}
          onChange={typingHandler}
          className='className="form-control--textarea"'
          ref={messageRef}
          placeholder="Type something..."
        />
      </div>
      <div className="chat-form--submit">
        <Button onClick={submit} disabled={disabledSubmit}>
          <GrSend color="#fff" />
          Send
        </Button>
      </div>
    </div>
  )
}

export default ChatForm
