import React, {
  useContext,
  useRef,
  useEffect,
  useState,
  useCallback,
  RefObject,
  MutableRefObject,
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
  activeChannel: Channel
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

// : React.FC<ChatFormProps>

const ChatForm = React.forwardRef<HTMLTextAreaElement, ChatFormProps>(
  ({ activeChannel }, ref) => {
    const { socket } = useContext(SocketContext)
    const { auth } = useContext(AuthContext)
    const [disabledSubmit, setDisabledSubmit] = useState(true)
    const [cachedMessages, setCachedMessages] = useState<
      Record<string, string>
    >({})

    const activeChannelIdRef = useRef(activeChannel._id)
    const messageRef = ref as MutableRefObject<HTMLTextAreaElement>

    useEffect(() => {
      if (messageRef && messageRef.current) {
        messageRef.current.focus()
        messageRef.current.addEventListener('keydown', _handleKeyDown)
      }

      return () => {
        if (messageRef.current)
          messageRef.current.removeEventListener('keydown', _handleKeyDown)
      }
    }, [messageRef])

    useEffect(() => {
      if (activeChannelIdRef.current) {
        const cachedMessage = messageRef.current.value
          ? messageRef.current.value
          : ''

        setCachedMessages({
          ...cachedMessages,
          [activeChannelIdRef.current]: cachedMessage,
        })
      }

      activeChannelIdRef.current = activeChannel._id
      messageRef.current.value = cachedMessages[activeChannel._id] || ''
      setDisabledSubmit(!messageRef.current.value)
      messageRef.current.focus()
    }, [activeChannel])

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
            channelId: activeChannelIdRef.current,
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
            channelId: activeChannelIdRef.current,
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
            channelId: activeChannelIdRef.current,
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
        <div id="chat-form--input" className="form-control">
          <TextareaAutosize
            maxRows={4}
            onChange={typingHandler}
            className='className="form-control--textarea"'
            ref={ref}
            placeholder="Type something..."
          />
        </div>
        <div id="chat-form--submit">
          <Button onClick={submit} disabled={disabledSubmit}>
            <GrSend color="#fff" />
            Send
          </Button>
        </div>
      </div>
    )
  }
)

ChatForm.displayName = 'ChatForm'

export default ChatForm
