export type MockServerData = {
  titles: string[];
  descriptions: string[];
  previewImages: string[];
  cities: string[];
  prices: number[];
  users: string[];
  emails: string[];
  avatars: string[];
  userTypes: Array<'ordinary' | 'pro'>;
  propertyTypes: Array<'apartment' | 'house' | 'room' | 'hotel'>;
  amenities: Array<'Breakfast' | 'Air conditioning' | 'Laptop friendly workspace' | 'Baby seat' | 'Washer' | 'Towels' | 'Fridge'>;
};
