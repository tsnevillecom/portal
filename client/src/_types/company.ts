import { User, Location } from './'

export type Company = {
  _id: string
  name: string
  accountId: string
  type: string
  phone: string
  address1: string
  address2: string
  city: string
  state: string
  postalCode: string
  countryCode: string
  locations: Location[]
  createdBy: User
  active: boolean
  updatedAt: string
}
