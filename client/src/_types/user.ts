export type User = {
  _id: string
  firstName: string
  lastName: string
  email: string
  active: boolean
  online: boolean
  isVerified: boolean
  role: UserRole
  updatedAt: string
}

export type UserRole = 'super-admin' | 'admin' | 'user' | 'guest'
