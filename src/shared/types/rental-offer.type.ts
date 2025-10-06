import { User } from './user.type.js';
import { City } from './city.type.js';

export type Amenities = 'Breakfast' | 'Air conditioning' | 'Laptop friendly workspace' | 'Baby seat' | 'Washer' | 'Towels' | 'Fridge';

export type PropertyType = 'apartment' | 'house' | 'room' | 'hotel';

export type RentalOffer = {
  title: string; // Наименование (10-100 символов)
  description: string; // Описание (20-1024 символа)
  postDate: Date; // Дата публикации
  city: City; // Один из шести городов
  previewImage: string; // Превью изображения
  photos: string[]; // Всегда 6 фото
  isPremium: boolean; // Флаг премиум
  rating: number; // 1-5, число с одной цифрой после запятой
  propertyType: PropertyType; // Тип жилья
  rooms: number; // Кол-во комнат (1-8)
  guests: number; // Кол-во гостей (1-10)
  price: number; // Стоимость аренды (100-100000)
  amenities: Amenities[];
  author: User; // Автор предложения
  commentsCount: number; // Количество комментариев (авто)
  coordinates: { latitude: number; longitude: number }; // Координаты
};
