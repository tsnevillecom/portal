export type Location = {
  _id: string
  name: string
  taxId: string
  companyId: string
  phone: string
  address1: string
  address2: string
  city: string
  state: string
  postalCode: string
  countryCode: string
  description: string
  createdBy: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export type NewLocation = {
  name: string
  taxId: string
  phone: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  countryCode?: string
  description?: string
  active: boolean
}
