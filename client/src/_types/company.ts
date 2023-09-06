import { User, Location } from './'

export type CompanyType = 'DSO' | 'PRIVATE'

export type Company = {
  _id: string
  name: string
  accountId: string
  type: CompanyType
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

export type NewCompany = {
  name: string
  type: string
  accountId: string
  phone: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  countryCode?: string
  active: boolean
}
