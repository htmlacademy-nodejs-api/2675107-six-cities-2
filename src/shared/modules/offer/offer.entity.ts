import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Amenities, PropertyType } from '../../types/rental-offer.type.js';
import { UserEntity } from '../user/user.entity.js';
import { CityName } from '../../types/city.type.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {

  @prop({ trim: true, required: true })
  public title: string;

  @prop({ trim: true })
  public description: string;

  @prop({required: true})
  public postDate: Date;

  @prop({
    type: () => String,
    enum: ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'],
    required: true
  })
  public city: CityName;

  @prop({required: true})
  public previewImage: string;

  @prop({required: true})
  public photos: string[];

  @prop({required: true})
  public isPremium: boolean;

  @prop({required: true})
  public rating: number;

  @prop({
    type: () => String,
    enum: ['apartment', 'house', 'room', 'hotel'],
    required: true
  })
  public propertyType: PropertyType;

  @prop({required: true})
  public rooms: number;

  @prop({required: true})
  public guests: number;

  @prop({ required: true })
  public price: number;

  @prop({
    type: () => String,
    enum: ['Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'],
    required: true
  })
  public amenities: Amenities[];

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId: Ref<UserEntity>;

  @prop({required: true,})
  public commentsCount: number;

  @prop({
    type: () => Object,
    required: true
  })
  public coordinates: { latitude: number; longitude: number };
}


export const OfferModel = getModelForClass(OfferEntity);
