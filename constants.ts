export const ERROR_CODES = {
  INVALID_CREDENTIALS: 'Invalid Credentials',
  INVALID_SESSION: 'Invalid Session',
  INVALID_CURRENCY: 'Invalid Currency',
  INVALID_EMAIL: 'Invalid Email',
  INVALID_PASSWORD: 'Invalid Password',
  USER_EXISTS: 'User Exists',
  NOT_EMPTY: 'Not Empty',
  SAME_WALLET: 'Same Wallet',
  INSUFFIENT_BALANCE: 'Insufficient Balance',
  NOT_FOUND: 'Not Found',
  USER_DOES_NOT_MATCH: 'User Does Not Match'
} as const

export const ERROR_CODES_ARRAY = Object.values(ERROR_CODES);

export const CURRENCY = {
  Naira: 'NGN',
  Dollar: 'USD',
} as const

export const CURRENCY_VALUES_ARRAY = Object.values(CURRENCY);

export const exchangeRate = 1500
