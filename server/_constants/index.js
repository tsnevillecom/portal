const CONSTANTS = {
  ERRORS: {
    REGISTRATION_FAILED: 'REGISTRATION_FAILED',
    SEND_EMAIL_FAILED: 'SEND_EMAIL_FAILED',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    GOOGLE_ERROR: 'GOOGLE_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    INVALID_EMAIL: 'INVALID_EMAIL',
    FORBIDDEN: 'FORBIDDEN',
    EMAIL_PASSWORD_REQUIRED: 'EMAIL_PASSWORD_REQUIRED',
    EXPIRED_TOKEN: 'EXPIRED_TOKEN',
    USER_VERIFIED: 'USER_VERIFIED',
    USER_NOT_VERIFIED: 'USER_NOT_VERIFIED',
    USER_EXISTS: 'USER_EXISTS',
    NOT_FOUND: 'NOT_FOUND',
    UPDATE_PASSWORD: 'UPDATE_PASSWORD',
  },
  SUCCESS: {
    SEND_EMAIL_SUCCESS: 'SEND_EMAIL_SUCCESS',
  },
}

module.exports = { ...CONSTANTS }
