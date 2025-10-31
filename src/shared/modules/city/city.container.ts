import { Container } from 'inversify';
import { CityService } from './city-service.interface.js';
import { types } from '@typegoose/typegoose';
import { CityEntity, CityModel } from './city.entity.js';
import { Component } from '../../types/component.enum.js';
import { DefaultCityService } from './default-city.service.js';

export function createCityContainer() {
  const cityContainer = new Container();
  cityContainer.bind<CityService>(Component.CityService).to(DefaultCityService).inSingletonScope();
  cityContainer.bind<types.ModelType<CityEntity>>(Component.CityModel).toConstantValue(CityModel);

  return cityContainer;
}
