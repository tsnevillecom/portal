import { User } from './user'

export type Channel = {
  _id: string
  name: string
  members: User[]
  createdBy: User
  active: boolean
  createdAt: string
  updatedAt: string
}
