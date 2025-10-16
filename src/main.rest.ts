import 'reflect-metadata';
import { RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { Container } from 'inversify';
import { createRestApplicationContainer } from './rest/rest-container.js';
import { createUserContainer} from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';
import { createCityContainer } from './shared/modules/city/city.container.js';
import { createUserOfferFavoriteContainer } from './shared/modules/user-offer-favorite/user-offer-favorite.container.js';
import { createCommentContainer } from './shared/modules/comment/comment.container.js';
// import { DefaultCommentService } from './shared/modules/comment/default-comment.service.js';
// import { DefaultOfferService } from './shared/modules/offer/index.js';
// import { DefaultUserOfferFavoriteService } from './shared/modules/user-offer-favorite/default-user-offer-favorite.service.js';

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
  // const commentService = appContainer.get<DefaultCommentService>(Component.CommentService);
  // const offerService = appContainer.get<DefaultOfferService>(Component.OfferService);
  // const userFavoriteService = appContainer.get<DefaultUserOfferFavoriteService>(Component.UserOfferFavoriteService);
  // const userService = appContainer.get<DefaultUserService>(Component.UserService);
  await application.init();

  //=============== isAuthorized USER ==============
  // const res = await userService.isAuthorized('68e386d2900a7f2da4ee5fe1');
  // console.log(res);

  // //=============== LOGIN USER ==============
  // const res = await userService.login('varayvfsdfsdfsd@list.ru','1234', 'SECRET');
  // console.log(res);

  // //=============== CREATE USER ==============
  // const res = await userService.findOrCreate({
  //   email: 'varayvfsdfsdfsd@list.ru',
  //   avatarPath: 'artem.jpg',
  //   firstname: 'Artem2',
  //   password: '123',
  //   userType: 'pro'
  // }, 'SECRET');
  // console.log(res);

  //=============== FIND COMMENTS OFFER ==============
  // const res = await commentService.findByOfferId('68e386d2900a7f2da4ee5fc4');
  // console.log(res);

  //=============== ADD COMMENTS ==============
  // const res = await commentService.create(
  //   {
  //     text: 'Комментарий второй',
  //     rating: 5,
  //   },
  //   '68e386d2900a7f2da4ee5fcf', //offerId,
  //   '68e386d2900a7f2da4ee5fe1' //userId
  // );
  // console.log(res);
  // await offerService.incCommentCountAndUpdateRating('68e386d2900a7f2da4ee5fcf', res.rating); //offerId

  //=============== ADD TO FAVORITE OFFER ==============
  // const res = await userFavoriteService.addToFavorites(
  //   '68e386d2900a7f2da4ee6036',
  //   '68e386d2900a7f2da4ee6003'
  // );
  // console.log(res);

  //=============== REMOVE TO FAVORITE OFFER ==============
  // const res = await userFavoriteService.removeFromFavorites(
  //   '68e386d2900a7f2da4ee6036',
  //   '68e386d2900a7f2da4ee6003'
  // );
  // console.log(res);

  //=============== FIND FAVORITE OFFER ==============
  // const res = await offerService.findFavoriteOffer(
  //   '68e386d2900a7f2da4ee5fbe',
  // );
  // console.log(res);

  //=============== FIND PREMIUM OFFER BY CITY ==============
  // const res = await offerService.findPremiumOfferByCity(
  //   'Cologne',
  // );
  // console.log(res);

  //=============== DELETE ==============
  // await commentService.deleteByOfferId('68e386d2900a7f2da4ee5fc4');
  // const res = await offerService.deleteById(
  //   '68e386d2900a7f2da4ee5fc4',
  //   '68e386d2900a7f2da4ee5fbe'
  // );
  // console.log(res);


  //=============== UPDATE ==============
  // const res = await offerService.updateById('68e386d2900a7f2da4ee6003', {
  //   isPremium: true,
  // }, '68e386d2900a7f2da4ee5fbe');
  // console.log(res);

  //=============== CREATE ==============
  // await offerService.create({
  //   title: 'кАЙФАРИК',
  //   description: 'КАЙФАРИК описание',
  //   city: 'Amsterdam',
  //   previewImage: 'afa.jpg',
  //   photos: ['1.png','1.png','1.png','1.png','1.png','1.png'],
  //   isPremium: true,
  //   propertyType: 'apartment',
  //   rooms: 5,
  //   guests: 3,
  //   price: 50000,
  //   amenities: ['Air conditioning', 'Baby seat'],
  // }, '68e386d2900a7f2da4ee5fd3');

  //=============== FIND ==============
  // const offerFind = await offerService.find(15, '68e386d2900a7f2da4ee5fbe');
  // console.log(offerFind);
  // console.log(offerFind.length);

  //=============== FIND BY ID ==============
  // const offerFind = await offerService.findById('68ef54082a49fd126c8a3379');
  // console.log(offerFind);
}

bootstrap();
