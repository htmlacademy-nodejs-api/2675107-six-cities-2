import { Container } from 'inversify';
import { CityService } from './city-service.interface.js';
import { types } from '@typegoose/typegoose';
import { CityEntity, CityModel } from './city.entity.js';
import { Component } from '../../types/component.enum.js';
import { DefaultCityService } from './default-city.service.js';

export function createUserContainer() {
  const cityContainer = new Container();
  cityContainer.bind<CityService>(Component.UserService).to(DefaultCityService).inSingletonScope();
  cityContainer.bind<types.ModelType<CityEntity>>(Component.CityModel).toConstantValue(CityModel);

  return cityContainer;
}
