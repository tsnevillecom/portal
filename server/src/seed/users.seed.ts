import ROLES from '../config/roles'
import User from '../models/user.model'

class UsersSeed {
  public seed = async (): Promise<void> => {
    console.log('Seeding users collection')

    const users = [
      {
        firstName: 'Tim',
        lastName: 'SuperAdmin',
        email: 'tsneville@gmail.com',
        password: null,
        isVerified: true,
        role: ROLES.SUPER_ADMIN,
      },
      {
        firstName: 'Tim',
        lastName: 'Admin',
        email: 'tsneville+admin@gmail.com',
        password: '12345678',
        isVerified: true,
        role: ROLES.ADMIN,
      },
      {
        firstName: 'Tim',
        lastName: 'User',
        email: 'tsneville+user@gmail.com',
        password: '12345678',
        isVerified: true,
        role: ROLES.USER,
      },
      {
        firstName: 'Tim',
        lastName: 'Guest',
        email: 'tsneville+guest@gmail.com',
        password: '12345678',
        isVerified: true,
        role: ROLES.GUEST,
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
