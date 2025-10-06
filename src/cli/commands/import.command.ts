import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { createOffer, getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { UserService } from '../../shared/modules/user/user-service.interface.js';
import { DatabaseClient } from '../../shared/libs/database-client/database-client.interface.js';
import { Logger } from '../../shared/libs/logger/logger.interface.js';
import { PinoLogger } from '../../shared/libs/logger/pino.logger.js';
import { DefaultUserService } from '../../shared/modules/user/default-user.service.js';
import { MongoDatabaseClient } from '../../shared/libs/database-client/mongo.database-client.js';
import { UserModel } from '../../shared/modules/user/user.entity.js';
import { RentalOffer } from '../../shared/types/rental-offer.type.js';
import { DEFAULT_DB_PORT} from './command.constant.js';
import { CityService } from '../../shared/modules/city/city-service.interface.js';
import { CityModel } from '../../shared/modules/city/city.entity.js';
import { DefaultCityService } from '../../shared/modules/city/default-city.service.js';
import { OfferService } from '../../shared/modules/offer/offer-service.interface.js';
import { OfferModel } from '../../shared/modules/offer/offer.entity.js';
import { DefaultOfferService } from '../../shared/modules/offer/default-offer.service.js';
import { UserOfferFavoriteService } from '../../shared/modules/user-offer-favorite/user-offer-favorite-service.interface.js';
import { DefaultUserOfferFavoriteService } from '../../shared/modules/user-offer-favorite/default-user-offer-favorite.service.js';
import { UserOfferFavoriteModel } from '../../shared/modules/user-offer-favorite/user-offer-favorite.entity.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private cityService: CityService;
  private offerService: OfferService;
  private UserOfferFavoriteService: UserOfferFavoriteService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new PinoLogger();
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.cityService = new DefaultCityService(this.logger, CityModel);
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.UserOfferFavoriteService = new DefaultUserOfferFavoriteService(this.logger, UserOfferFavoriteModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    console.info(offer);

    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: RentalOffer) {

    const user = await this.userService.findOrCreate({
      ...offer.author,
      avatarPath: offer.author.avatarPath || '',
    }, this.salt);

    const city = await this.cityService.findOrCreate({
      ...offer.city,
    });

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      postDate: offer.postDate,
      city: city.name,
      previewImage: offer.previewImage,
      photos: offer.photos,
      isPremium: offer.isPremium,
      rating: offer.rating,
      propertyType: offer.propertyType,
      rooms: offer.rooms,
      guests: offer.guests,
      price: offer.price,
      amenities: offer.amenities,
      userId: user.id,
      commentsCount: offer.commentsCount,
      coordinates: {
        latitude: city.latitude,
        longitude: city.longitude
      }
    });

    await this.UserOfferFavoriteService.createIfNotExists({
      userId: '68e37958ed3dd2ede3818ef9',
      offerId: '68e37958ed3dd2ede3818efb'
    });
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
