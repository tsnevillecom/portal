import { User } from './user'

export type Room = {
  name: string
  members: User[]
  createdBy: User
  deleted: boolean
  createdAt: string
  updatedAt: string
}
