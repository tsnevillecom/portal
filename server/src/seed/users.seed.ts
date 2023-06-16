import config from '../config'
import User from '../models/user'

class UsersSeed {
  public seed = async (): Promise<void> => {
    console.log('Seeding users collection')

    const users = [
      {
        firstName: 'Tim',
        lastName: 'Neville',
        email: 'tsneville@gmail.com',
        password: config.ADMIN_PASSWORD,
        isVerified: true,
        role: 'admin',
      },
      {
        firstName: 'Music',
        lastName: 'Fan',
        email: 'tsneville+fan@gmail.com',
        password: '12345678',
        isVerified: true,
        role: 'fan',
      },
    ]

    for (const user of users) {
      const foundUser = await User.exists({ email: user.email })

      if (foundUser) {
        console.log(`${user.email} exists`)
        continue
      }

      await new User(user).save()
      console.log(`${user.email} created`)
    }
  }
}

export default UsersSeed
