import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { City, CityName } from '../../types/city.type.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CityEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'cities',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CityEntity extends defaultClasses.TimeStamps implements City {
  @prop({ unique: true, required: true })
  public name: CityName;

  @prop({ required: true })
  public latitude: number;

  @prop({ required: true })
  public longitude: number;


  constructor(cityData: City) {
    super();

    this.name = cityData.name;
    this.latitude = cityData.latitude;
    this.longitude = cityData.longitude;
  }

}


export const CityModel = getModelForClass(CityEntity);
