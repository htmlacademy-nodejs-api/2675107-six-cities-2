import { inject, injectable } from 'inversify';
import { CityService } from './city-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CityEntity } from './city.entity.js';
import { CreateCityDto } from './dto/create-city.dto.js';


@injectable()
export class DefaultCityService implements CityService{
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CityModel) private readonly cityModel: types.ModelType<CityEntity>
  ) {}

  public async create(dto: CreateCityDto): Promise<DocumentType<CityEntity>> {
    const city = new CityEntity(dto);

    const result = await this.cityModel.create(city);
    this.logger.info(`New user created: ${city.name}`);

    return result;
  }

  public async findByCityName(name: string): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findOne({name});
  }

  public async findOrCreate(dto: CreateCityDto): Promise<DocumentType<CityEntity>> {
    const existedCity = await this.findByCityName(dto.name);

    if (existedCity) {
      return existedCity;
    }

    return this.create(dto);
  }
}
