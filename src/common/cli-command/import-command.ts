import {CliCommandInterface} from './cli-command.interface.js';
import TSVFileReader from '../file-reader/tsv-file-reader.js';
import {getErrorMessage, getConnectionString} from '../helpers/common.js';
import chalk from 'chalk';
import {createOffer} from '../helpers/offer.js';
import {UserServiceInterface} from '../../modules/user/user-service.interface.js';
import {OfferServiceInterface} from '../../modules/offer/offer-service.interface.js';
import {DatabaseClientInterface} from '../database-client/database-client.interface.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import ConsoleLoggerService from '../logger/console.logger.service.js';
import OfferService from '../../modules/offer/offer.service.js';
import {OfferModel} from '../../modules/offer/offer.entity.js';
import UserService from '../../modules/user/user.service.js';
import {UserModel} from '../../modules/user/user.entity.js';
import MongoClientService from '../database-client/mongo-client.service.js';
import {OfferType} from '../../types/offer.type.js';
import {DEFAULT_USER_PASSWORD, DEFAULT_DB_PORT} from '../helpers/consts.js';
import {CommentServiceInterface} from '../../modules/comments/comment-service.interface';


export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private offerService!: OfferServiceInterface;
  private databaseService!: DatabaseClientInterface;
  private readonly logger: LoggerInterface;
  private commentService!: CommentServiceInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.offerService = new OfferService(this.logger, OfferModel, this.commentService);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new MongoClientService(this.logger);
  }

  private async saveOffer(offer: OfferType) {
    const user = await this.userService.findOrCreate({
      ...offer.offerAuthor,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.create({
      ...offer,
      userId: user.id,
    });
  }

  private async onLine(line: string, resolve: VoidFunction) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onComplete(count: number) {
    this.logger.info(`${count} строк импортировано`);
    this.databaseService.disconnect();
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename, login, password, host, dbname, salt] = parameters;
    const uri = getConnectionString(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseService.connect(uri);
    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('row', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      this.logger.error(`${chalk.redBright(`Не вышло прочитать файл. Ошибка: ${getErrorMessage(err)}`)}`);
    }
  }
}
