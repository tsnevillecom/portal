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
    ]

    for (const user of users) {
      const foundUser = await User.exists({ email: user.email })

      if (foundUser) {
        console.log('Admin exists')
        return
      }

      await new User(user).save()
      console.log('Admin created')
    }
  }
}

export default UsersSeed
