import 'reflect-metadata';
import {LoggerInterface} from '../common/logger/logger.interface.js';
import {ConfigInterface} from '../common/config/config.interface.js';
import {inject, injectable} from 'inversify';
import {Component} from '../types/component.enum.js';
import {ConfigSchema} from '../common/config/config.schema.js';
import {DatabaseClientInterface} from '../common/database-client/database-client.interface.js';
import {getConnectionString} from '../common/helpers/common.js';
import express, { Express } from 'express';
import {ControllerInterface} from '../common/controller/controller.interface.js';
import {ExceptionFilter} from '../common/http/exception-fliter.interface.js';


@injectable()
export default class Application {
  private expressApplication: Express;
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.ConfigInterface) private readonly config: ConfigInterface<ConfigSchema>,
    @inject(Component.DatabaseClientInterface) private readonly databaseClient: DatabaseClientInterface,
    @inject(Component.OfferController) private readonly offerController: ControllerInterface,
    @inject(Component.UserController) private userController: ControllerInterface,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
  ) {
    this.expressApplication = express();
  }

  private async _initMiddleware() {
    this.expressApplication.use(express.json());
  }

  private async _initServer() {
    this.logger.info('Сервер инициализируется');

    const port = this.config.get('PORT');
    this.expressApplication.listen(port);

    this.logger.info(`Сервер успешно стартован на http://localhost:${this.config.get('PORT')}`);
  }

  private async _initRoutes() {
    this.logger.info('Контроллеры инициализируются');
    this.expressApplication.use('/offers', this.offerController.router);
    this.expressApplication.use('/users', this.userController.router);
    this.logger.info('Контроллеры успешно инициализированы');
  }

  private async _initExceptionFilters() {
    this.expressApplication.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  public async init() {
    this.logger.info('Приложение инициализировано');
    this.logger.info(`PORT: ${this.config.get('PORT')}`);
    this.logger.info(`DB_HOST: ${this.config.get('DB_HOST')}`);
    this.logger.info(`SALT: ${this.config.get('SALT')}`);

    this.logger.info('База данных инициализируется');
    const mongoUri = getConnectionString(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(mongoUri);
    this.logger.info('База данных инициализирована');
    await this._initRoutes();
    await this._initMiddleware();
    await this._initExceptionFilters();
    await this._initServer();
  }
}
