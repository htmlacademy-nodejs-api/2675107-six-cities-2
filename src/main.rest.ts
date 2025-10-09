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
import { OfferModel } from './shared/modules/offer/offer.entity.js';
import { DefaultOfferService } from './shared/modules/offer/default-offer.service.js';
import { PinoLogger } from './shared/libs/logger/pino.logger.js';


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

  const logger = new PinoLogger;

  const offerService = new DefaultOfferService(logger, OfferModel);

  const offer = await offerService.find(5);
  console.log(offer);
  console.log(offer.length);
}

bootstrap();
