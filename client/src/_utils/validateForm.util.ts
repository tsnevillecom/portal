import { Errors, FormFieldValue, Rules } from '@types'
import _ from 'lodash'

// eslint-disable-next-line no-useless-escape
const EMAIL_REGEX = /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

export const validateForm = (fields: FormFieldValue, rules: Rules): Errors => {
  const errors: Errors = {}

  _.each(fields, (value, key) => {
    const fieldRules = rules[key]
    if (!fieldRules) return

    if (fieldRules.required && !value) {
      errors[key] = 'Required field'
    } else if (
      fieldRules.requiredIf &&
      !value &&
      _.chain(fieldRules.requiredIf as string[])
        .map((f) => !!fields[f])
        .includes(true)
        .value()
    ) {
      errors[key] = 'Required field'
    } else if (fieldRules.length && value.length !== fieldRules.length) {
      errors[key] = `Must be ${fieldRules.length} numeric digits`
    } else if (fieldRules.password) {
      if (
        !(
          value.length >= 8 &&
          /[A-Z]+/.test(value) &&
          /[a-z]+/.test(value) &&
          /[0-9]+/.test(value) &&
          /[^A-Za-z0-9]+/.test(value)
        )
      ) {
        errors[key] = `Invalid password`
      }
    } else if (fieldRules.email && !EMAIL_REGEX.test(value)) {
      errors[key] = `Invalid email address`
    }
  })

  return errors
}
