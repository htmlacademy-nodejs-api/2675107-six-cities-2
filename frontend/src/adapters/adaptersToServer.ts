import { CreateOfferDto } from '../dto/offers/create-offer.dto';
import { CreateUserDto } from '../dto/users/create-user.dto';
import { NewOffer, UserRegister } from '../types/types';


export const adaptAvatarToServer =
  (file: string) => {
    const formData = new FormData();
    formData.set('avatar', file);

    return formData;
  };

export const adaptSignupToServer =
    (user: UserRegister): CreateUserDto => ({
      firstname: user.name,
      email: user.email,
      password: user.password,
      userType: user.userType
    });


export const adaptCreateOfferToServer =
  (offer: NewOffer): CreateOfferDto => ({
    title: offer.title,
    description: offer.description,
    city: offer.city.name,
    isPremium: offer.isPremium,
    propertyType: offer.type,
    rooms: offer.bedrooms,
    guests: offer.maxAdults,
    price: offer.price,
    amenities: offer.goods,
    coordinates: { latitude: offer.location.latitude, longitude: offer.location.longitude}
  });

export const adaptOffer = (o: any) => ({
  id: o.id,
  title: o.title,
  price: o.price,
  isPremium: o.isPremium,
  rating: o.rating,
  commentsCount: o.commentsCount,
  isFavorite: o.isFavorite,
  previewImage: o.previewImage,
  type: o.propertyType,
  city: {
    name: o.city
  },
  location: {
    lat: o.coordinates?.latitude ?? 0,
    lng: o.coordinates?.longitude ?? 0,
  }
});
