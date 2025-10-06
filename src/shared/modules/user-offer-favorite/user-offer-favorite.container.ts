import { Container } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { types } from '@typegoose/typegoose';
import { UserOfferFavoriteService } from './user-offer-favorite-service.interface.js';
import { DefaultUserOfferFavoriteService } from './default-user-offer-favorite.service.js';
import { UserOfferFavoriteEntity, UserOfferFavoriteModel } from './user-offer-favorite.entity.js';


export function createUserOfferFavoriteContainer() {
  const userOfferFavoriteContainer = new Container();
  userOfferFavoriteContainer.bind<UserOfferFavoriteService>(Component.UserOfferFavoriteService).to(DefaultUserOfferFavoriteService).inSingletonScope();
  userOfferFavoriteContainer.bind<types.ModelType<UserOfferFavoriteEntity>>(Component.UserOfferFavoriteModel).toConstantValue(UserOfferFavoriteModel);

  return userOfferFavoriteContainer;
}
