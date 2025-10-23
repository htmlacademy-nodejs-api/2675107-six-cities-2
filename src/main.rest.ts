import 'reflect-metadata';
import { RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { Container } from 'inversify';
import { createRestApplicationContainer } from './rest/rest-container.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';
import { createCityContainer } from './shared/modules/city/city.container.js';
import { createUserOfferFavoriteContainer } from './shared/modules/user-offer-favorite/user-offer-favorite.container.js';
import { createCommentContainer } from './shared/modules/comment/comment.container.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCityContainer(),
    createUserOfferFavoriteContainer(),
    createCommentContainer()
  );

  const application = appContainer.get<RestApplication>(Component.RestApplication);

  await application.init();
}

bootstrap();
