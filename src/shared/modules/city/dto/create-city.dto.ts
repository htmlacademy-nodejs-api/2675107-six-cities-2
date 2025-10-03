import { CityName } from '../../../types/city.type.js';

export class CreateCityDto {
  public name: CityName;
  public latitude: number;
  public longitude: number;
}
