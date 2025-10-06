import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { OfferEntity } from '../offer/offer.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserOfferFavoriteEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'user-offer-favorite',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserOfferFavoriteEntity extends defaultClasses.TimeStamps {

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId: Ref<UserEntity>;

  @prop({
    ref: OfferEntity,
    required: true,
  })
  public offerId: Ref<OfferEntity>;
}


export const UserOfferFavoriteModel = getModelForClass(UserOfferFavoriteEntity);
