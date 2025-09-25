import { User } from './user.type.js';
import { City } from './city.type.js';

export type RentalOffer = {
  title: string; // Наименование (10-100 символов)
  description: string; // Описание (20-1024 символа)
  postDate: Date; // Дата публикации
  city: City; // Один из шести городов
  previewImage: string; // Превью изображения
  photos: string[]; // Всегда 6 фото
  isPremium: boolean; // Флаг премиум
  isFavorite: boolean; // Флаг избранного
  rating: number; // 1-5, число с одной цифрой после запятой
  propertyType: 'apartment' | 'house' | 'room' | 'hotel'; // Тип жилья
  rooms: number; // Кол-во комнат (1-8)
  guests: number; // Кол-во гостей (1-10)
  price: number; // Стоимость аренды (100-100000)
  amenities: Array<'Breakfast' | 'Air conditioning' | 'Laptop friendly workspace' | 'Baby seat' | 'Washer' | 'Towels' | 'Fridge'>;
  author: User; // Автор предложения
  commentsCount: number; // Количество комментариев (авто)
  coordinates: { latitude: number; longitude: number }; // Координаты
};
