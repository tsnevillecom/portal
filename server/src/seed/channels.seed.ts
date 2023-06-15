import Channel from '../models/channel'
import User from '../models/user'

class ChannelsSeed {
  public seed = async (): Promise<void> => {
    console.log('Seeding rooms collection')

    const user = await User.exists({
      email: 'tsneville@gmail.com',
      role: 'admin',
    })

    const channels = [
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

    for (const channel of channels) {
      const foundRoom = await Channel.exists({
        name: channel.name,
        createdBy: user._id,
      })

      if (foundRoom) {
        console.log(`Room exists: ${channel.name}`)
        continue
      }

      await new Channel(channel).save()
    }

    console.log('Rooms created')
  }
}

export default ChannelsSeed
