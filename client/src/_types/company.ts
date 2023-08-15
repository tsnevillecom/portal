import { User } from './user'

export type Company = {
  _id: string
  name: string
  accountId: string
  locations: string[]
  createdBy: User
  deleted: boolean
}
