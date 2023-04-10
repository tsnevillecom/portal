import Button from '@components/Button'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import './Rooms.scss'
import { Room } from '@types'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import Page from '@components/Page'
import { act } from 'react-dom/test-utils'
import { classNames } from '@utils/classNames.util'

const Rooms = () => {
  const axiosPrivate = useAxiosPrivate()
  const [rooms, setRooms] = useState<Room[]>([])
  const [activeRoom, setAtiveRoom] = useState<Room | null>(null)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    try {
      const response = await axiosPrivate('/rooms')
      setRooms(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Page id="chat" flex={true}>
      <div id="chat-rooms">
        <h1>Rooms</h1>
        <div id="new-room">+</div>

        {_.map(rooms, (room, i) => {
          const cx = {
            ['chat-rooms--room']: true,
            active: room._id === activeRoom?._id,
          }

          const chatRoomClasses = classNames(cx)

          return (
            <div
              className={chatRoomClasses}
              onClick={() => setAtiveRoom(room)}
              key={i}
            >
              {room.name}
            </div>
          )
        })}
      </div>

      <div id="chat-room">
        <div id="chat-room--header">{activeRoom?.name}</div>
        <div id="chat-room--thread"></div>
        <div id="chat-room--input">
          <input type="text" id="chat-input" />
        </div>
      </div>
    </Page>
  )
}

export default Rooms
