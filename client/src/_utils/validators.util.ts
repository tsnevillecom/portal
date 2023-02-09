export const required = (value: any) => (value ? undefined : 'Required')

export const maxLength = (max: number) => (value: string) =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined

export const minLength = (min: number) => (value: string) =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined

export const minLength4 = minLength(4)
export const minLength8 = minLength(8)

export const number = (value: string | number) =>
  value && isNaN(Number(value)) ? 'Must be a number' : undefined

export const minValue = (min: number) => (value: number) =>
  value && value < min ? `Must be at least ${min}` : undefined

export const email = (value: string) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined

export const specialChars = (value: string) =>
  value && !/^[a-zA-Z0-9]{4,10}$/i.test(value)
    ? 'No spaces or special characters allowed'
    : undefined

export const passwordsMustMatch = (
  password: string,
  passwordConfirmation: string
) => {
  return password !== passwordConfirmation
    ? 'Passwords do not match'
    : undefined
}

export const aol = (value: string) =>
  value && /.+@aol\.com/.test(value)
    ? 'Really? You still use AOL for your email?'
    : undefined
