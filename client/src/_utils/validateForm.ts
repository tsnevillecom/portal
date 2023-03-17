import { Errors, FormFieldValue, Rules } from '../_types'
import _ from 'lodash'

export const validateForm = (fields: FormFieldValue, rules: Rules): Errors => {
  const errors: Errors = {}

  _.each(fields, (value, key) => {
    const fieldRules = rules[key]
    if (!fieldRules) return

    if (fieldRules.required && !value) {
      errors[key] = 'Required Field'
    } else if (
      fieldRules.requiredIf &&
      !value &&
      _.chain(fieldRules.requiredIf as string[])
        .map((f) => !!fields[f])
        .includes(true)
        .value()
    ) {
      errors[key] = 'Required Field'
    } else if (fieldRules.length && value.length !== fieldRules.length) {
      errors[key] = `Must be ${fieldRules.length} numeric digits`
    }
  })

  return errors
}
