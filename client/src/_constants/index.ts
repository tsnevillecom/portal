import STATES from './states'

const CONSTANTS = {
  SESSION_TIMEOUT: 7200000, //2 hours
  SESSION_TIMEOUT_ALERT: 600000, //10 minutes
  COMPANY_TYPE: {
    DSO: 'DSO',
    PRIVATE: 'Private',
  },
  STATES: STATES,

  ROLES: {
    'super-admin': 'Super-Admin',
    admin: 'Admin',
    user: 'User',
    guest: 'Guest',
  },

  BREAKPOINTS: {
    xs: '480px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1280px',
  },

  BREAKPOINTS_MAX: {
    xs: '479px',
    sm: '575px',
    md: '767px',
    lg: '991px',
    xl: '1279px',
  },
}

export default CONSTANTS
