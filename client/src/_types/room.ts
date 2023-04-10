import { User } from './user'

export type Room = {
  _id: string
  name: string
  members: User[]
  createdBy: User
  deleted: boolean
  createdAt: string
  updatedAt: string
}
