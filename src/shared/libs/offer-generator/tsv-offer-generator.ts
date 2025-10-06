import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const previewImage = getRandomItem(this.mockData.previewImages);
    const cityName = getRandomItem(this.mockData.cities);
    const price = getRandomItem(this.mockData.prices);
    const firstname = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const avatarPath = getRandomItem(this.mockData.avatars);
    const userType = getRandomItem(this.mockData.userTypes);

    const isPremium = Math.random() > 0.5;
    const rating = (Math.random() * 4 + 1).toFixed(1); // от 1.0 до 5.0
    const propertyType = getRandomItem(this.mockData.propertyTypes);
    const rooms = generateRandomValue(1, 8);
    const guests = generateRandomValue(1, 10);
    const amenities = getRandomItems(this.mockData.amenities).join(';');

    const createdDate = dayjs()
      .subtract(generateRandomValue(1, 7), 'day')
      .toISOString();

    return [
      title,
      description,
      createdDate,
      previewImage,
      cityName,
      price,
      firstname,
      email,
      avatarPath,
      userType,
      isPremium,
      rating,
      propertyType,
      rooms,
      guests,
      amenities
    ].join('\t');
  }
}
