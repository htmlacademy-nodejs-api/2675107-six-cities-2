import { CityName, Goods, Type } from '../../types/types';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public city!: CityName;
  public isPremium!: boolean;
  public propertyType!: Type;
  public rooms!: number;
  public guests!: number;
  public price!: number;
  public amenities!: Goods[];
  public coordinates!: { latitude: number; longitude: number };
}
