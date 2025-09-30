import { RentalOffer, User, City } from '../types/index.js';

export function createOffer(offerData: string): RentalOffer {
  const [
    title,
    description,
    createdDate,
    previewImage,
    cityName,
    price,
    firstname,
    email,
    avatarPath,
    isPremium,
    isFavorite,
    rating,
    propertyType,
    rooms,
    guests,
    amenities
  ] = offerData.replace('\n', '').split('\t');

  const cities: Record<string, City> = {
    Paris : { name: 'Paris', latitude: 48.85661, longitude: 2.351499 },
    Cologne: { name: 'Cologne', latitude: 50.938361, longitude: 6.959974 },
    Brussels: { name: 'Brussels', latitude: 50.846557, longitude: 4.351697 },
    Amsterdam : { name: 'Amsterdam', latitude: 52.370216, longitude: 4.895168 },
    Hamburg : { name: 'Hamburg', latitude: 53.550341, longitude: 10.000654 },
    Dusseldorf : { name: 'Dusseldorf', latitude: 51.225402, longitude: 6.776314 },
  };

  const user: User = {
    firstname: firstname.trim(),
    email: email.trim(),
    avatarPath: avatarPath?.trim() || 'default-avatar.jpg',
    password: 'default123', // дефолтный пароль
    userType: 'ordinary'
  };

  const city: City = cities[cityName] || {
    name: cityName,
    latitude: 0,
    longitude: 0,
  };

  const offer: RentalOffer = {
    title: title.trim(),
    description: description.trim(),
    postDate: new Date(createdDate),
    city,
    previewImage: previewImage.trim(),
    photos: Array(6).fill(previewImage.trim()),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: Number(rating),
    propertyType: propertyType as RentalOffer['propertyType'],
    rooms: Number(rooms),
    guests: Number(guests),
    price: Number(price),
    amenities: amenities.split(';') as RentalOffer['amenities'],
    author: user,
    commentsCount: 0,
    coordinates: {
      latitude: city.latitude,
      longitude: city.longitude,
    }
  };

  return offer;
}
