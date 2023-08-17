import ROLES from '../config/roles'
import Channel from '../models/channel.model'
import User from '../models/user.model'

class ChannelsSeed {
  public seed = async (): Promise<void> => {
    console.log('Seeding channel collection')

    const superAdmin = await User.exists({
      email: 'tsneville@gmail.com',
      role: ROLES.SUPER_ADMIN,
    })

    const admin = await User.exists({
      email: 'tsneville+admin@gmail.com',
      role: ROLES.ADMIN,
    })

    const user = await User.exists({
      email: 'tsneville+user@gmail.com',
      role: ROLES.USER,
    })

    const channels = [
      {
        name: 'General',
        createdBy: superAdmin._id,
        members: [superAdmin._id, user._id],
      },
      {
        name: 'Admins',
        createdBy: superAdmin._id,
        members: [superAdmin._id],
      },
      {
        name: 'Random',
        createdBy: superAdmin._id,
        members: [superAdmin._id, admin._id, user._id],
      },
      {
        name: 'Inactive',
        createdBy: superAdmin._id,
        members: [superAdmin._id, admin._id],
        active: false,
      },
    ]

    for (const channel of channels) {
      const foundRoom = await Channel.exists({
        name: channel.name,
        createdBy: superAdmin._id,
      })

      if (foundRoom) {
        console.log(`Channel exists: ${channel.name}`)
        continue
      }

      await new Channel(channel).save()
      console.log(`Channel created: ${channel.name}`)
    }
  }
}

export default ChannelsSeed
