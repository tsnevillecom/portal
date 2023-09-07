import { Option } from '@types'
import CONSTANTS from '.'

export const companyTypeOptions: Option[] = [
  { value: 'PRIVATE', label: 'Private Company' },
  { value: 'DSO', label: 'DSO' },
]

export const statesOptions: Option[] = Object.entries(CONSTANTS.STATES).map(
  ([k, v]) => {
    return {
      value: k,
      label: v,
    }
  }
)
