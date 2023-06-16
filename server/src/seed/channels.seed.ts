import Channel from '../models/channel'
import User from '../models/user'

class ChannelsSeed {
  public seed = async (): Promise<void> => {
    console.log('Seeding rooms collection')

    const admin = await User.exists({
      email: 'tsneville@gmail.com',
      role: 'admin',
    })

    const fan = await User.exists({
      email: 'tsneville+fan@gmail.com',
      role: 'fan',
    })

    const channels = [
      {
        name: 'General',
        createdBy: admin._id,
        members: [admin._id],
      },
      {
        name: 'Admins',
        createdBy: admin._id,
        members: [admin._id],
      },
      {
        name: 'Random',
        createdBy: admin._id,
        members: [admin._id, fan._id],
      },
    ]

    for (const channel of channels) {
      const foundRoom = await Channel.exists({
        name: channel.name,
        createdBy: admin._id,
      })

      if (foundRoom) {
        console.log(`Room exists: ${channel.name}`)
        continue
      }

      await new Channel(channel).save()
      console.log(`${channel.name} created`)
    }
  }
}

export default ChannelsSeed
