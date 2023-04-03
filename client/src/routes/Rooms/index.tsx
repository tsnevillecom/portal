import Button from '@components/Button'
import useAxiosPrivate from '@hooks/useAxiosPrivate'
import './Rooms.scss'
import { Room } from '@types'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import Page from '@components/Page'

const Rooms = () => {
  const axiosPrivate = useAxiosPrivate()
  const [rooms, setRooms] = useState<Room[]>([])

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
      <div id="chat-channels">
        {_.map(rooms, (room, i) => (
          <div key={i}>{room.name}</div>
        ))}

        <Button>New</Button>
      </div>

      <div id="chat-room">
        <div id="chat-room-header">Room Alpha</div>
        <div id="chat-room-thread"></div>
        <div id="chat-room-input"></div>
      </div>
    </Page>
  )
}

export default Rooms
