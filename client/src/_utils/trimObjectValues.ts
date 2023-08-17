/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from 'lodash'

export const trimObjValues = (obj: { [name: string]: any }) => {
  return Object.keys(obj).reduce(
    (acc: { [name: string]: any }, curr: string) => {
      if (_.isString(obj[curr])) acc[curr] = obj[curr].trim()
      return acc
    },
    {}
  )
}
