import { User, Location } from './'

export type Company = {
  _id: string
  name: string
  accountId: string
  locations: Location[]
  createdBy: User
  active: boolean
  updatedAt: string
}
