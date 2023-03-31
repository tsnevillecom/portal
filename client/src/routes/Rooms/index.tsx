import useAxiosPrivate from '@hooks/useAxiosPrivate'
import { Room } from '@types'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'

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
    <section id="rooms-route">
      <h1>Rooms</h1>

      {_.map(rooms, (room, i) => (
        <div key={i}>{room.name}</div>
      ))}
    </section>
  )
}

export default Rooms
