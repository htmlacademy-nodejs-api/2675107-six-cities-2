
export const CreateUserValidationMessage = {
  email: {
    invalid: 'Incorrect email.'
  },
  firstname: {
    invalidFormat: 'firstname must be an string',
    minLength: 'Minimum firstname length must be 1',
    maxLength: 'Maximum firstname length must be 15',
  },
  password: {
    invalidFormat: 'password must be an string',
    minLength: 'Minimum password length must be 6',
    maxLength: 'Maximum password length must be 12',
  },
  userType: {
    invalid: 'type must be pro | ordinary',
  }
} as const;
