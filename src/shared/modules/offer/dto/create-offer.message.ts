export const CreateOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
    invalidFormat: 'Title must be an string',
  },
  description: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
    invalidFormat: 'Description must be an string',
  },
  city: {
    invalid: 'type must be Paris | Cologne | Brussels | Amsterdam | Hamburg | Dusseldorf'
  },
  previewImage: {
    invalidFormat: 'PreviewImage must be an string',
  },
  photos: {
    invalidFormat: 'Photos must be an array',
  },
  isPremium: {
    invalidFormat: 'isPremium must be an boolean',
  },
  propertyType: {
    invalid: 'type must be apartment | house | room | hotel',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 200000',
  },
  rooms: {
    minValue: 'Minimum rooms length must be 1',
    maxValue: 'Maximum rooms length must be 8',
    invalidFormat: 'Rooms must be an number',
  },
  guests: {
    minValue: 'Minimum guests length must be 1',
    maxValue: 'Maximum guests length must be 10',
    invalidFormat: 'Guests must be an number',
  },
  amenities: {
    invalid: 'type must be Breakfast | Air conditioning | Laptop friendly workspace | Baby seat | Washer | Towels | Fridge',
  },
  coordinates: {
    invalidFormat: 'Coordinates must be an object',
  }
} as const;
