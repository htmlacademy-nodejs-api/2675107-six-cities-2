import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { RentalOffer, User, City } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): RentalOffer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }


    const cities: Record<string, City> = {
      Paris : { name: 'Paris', latitude: 48.85661, longitude: 2.351499 },
      Cologne: { name: 'Cologne', latitude: 50.938361, longitude: 6.959974 },
      Brussels: { name: 'Brussels', latitude: 50.846557, longitude: 4.351697 },
      Amsterdam : { name: 'Amsterdam', latitude: 52.370216, longitude: 4.895168 },
      Hamburg : { name: 'Hamburg', latitude: 53.550341, longitude: 10.000654 },
      Dusseldorf : { name: 'Dusseldorf', latitude: 51.225402, longitude: 6.776314 },
    };

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(
        ([
          title,
          description,
          createdDate,
          previewImage,
          cityName,
          price,
          firstname,
          email,
          avatarPath,
        ]) => {
          const user: User = {
            firstname: firstname.trim(),
            email: email.trim(),
            avatarPath: avatarPath?.trim() || 'default-avatar.jpg',
            password: 'default123', // дефолтный пароль
            userType: 'ordinary', // дефолтный тип
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
            photos: Array(6).fill(previewImage.trim()), // 6 одинаковых фото
            isPremium: false,
            isFavorite: false,
            rating: 4.0,
            propertyType: 'apartment',
            rooms: 1,
            guests: 1,
            price: Number(price),
            amenities: ['Breakfast', 'Air conditioning'],
            author: user,
            commentsCount: 0,
            coordinates: {
              latitude: city.latitude,
              longitude: city.longitude,
            }
          };

          return offer;
        }
      );
  }
}
