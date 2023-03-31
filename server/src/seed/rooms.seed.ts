import Room from '../models/room'
import User from '../models/user'

class RoomsSeed {
  public seed = async (): Promise<void> => {
    console.log('Seeding rooms collection')

    const user = await User.exists({
      email: 'tsneville@gmail.com',
      role: 'admin',
    })

    const rooms = [
      {
        name: 'General',
        createdBy: user._id,
        members: [user._id],
      },
      {
        name: 'Admins',
        createdBy: user._id,
        members: [user._id],
      },
      {
        name: 'Random',
        createdBy: user._id,
        members: [user._id],
      },
    ]

    for (const room of rooms) {
      const foundRoom = await Room.exists({
        name: room.name,
        createdBy: user._id,
      })

      if (foundRoom) {
        console.log(`Room exists: ${room.name}`)
        continue
      }

      await new Room(room).save()
    }

    console.log('Rooms created')
  }
}

export default RoomsSeed
