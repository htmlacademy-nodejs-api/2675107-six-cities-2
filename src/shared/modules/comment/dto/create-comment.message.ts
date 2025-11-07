
export const CreateCommentValidationMessage = {
  text: {
    invalidFormat: 'text must be an string',
    minLength: 'Minimum text length must be 5',
    maxLength: 'Maximum text length must be 1024',
  },
  rating: {
    invalidFormat: 'rating must be an number',
    minValue: 'Minimum value rating must be 5',
    maxValue: 'Maximum value rating must be 5',
  }
} as const;
