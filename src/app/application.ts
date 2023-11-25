import 'reflect-metadata';
import {LoggerInterface} from '../common/logger/logger.interface.js';
import {ConfigInterface} from '../common/config/config.interface.js';
import {inject, injectable} from 'inversify';
import {Component} from '../types/component.enum.js';
import {ConfigSchema} from '../common/config/config.schema.js';
import {DatabaseClientInterface} from '../common/database-client/database-client.interface.js';
import {getConnectionString} from '../common/helpers/common.js';
import express, {Express} from 'express';
import {ControllerInterface} from '../common/controller/controller.interface.js';
import {ExceptionFilter} from '../common/http/exception-fliter.interface.js';
import {AuthenticateMiddleware} from '../common/middleware/authenticate.middleware.js';


@injectable()
export default class Application {
  private server: Express;

  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.ConfigInterface) private readonly config: ConfigInterface<ConfigSchema>,
    @inject(Component.DatabaseClientInterface) private readonly databaseClient: DatabaseClientInterface,
    @inject(Component.UserController) private readonly userController: ControllerInterface,
    @inject(Component.OfferController) private readonly offerController: ControllerInterface,
    @inject(Component.CommentController) private readonly commentController: ControllerInterface,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
  ) {
    this.server = express();
  }

  private async _initDb() {
    const mongoUri = getConnectionString(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async _initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _initRoutes() {
    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);
    this.server.use('/comments', this.commentController.router);
  }

  private async _initMiddleware() {
    this.server.use(express.json());
    this.server.use(
      '/upload',
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    const authenticateMiddleware = new AuthenticateMiddleware(this.config.get('JWT_SECRET'));
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
  }

  private async _initExceptionFilters() {
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization');

    this.logger.info('Init database');
    await this._initDb();
    this.logger.info('Init database completed');

    this.logger.info('Init middlewares');
    await this._initMiddleware();
    this.logger.info('Middlewares initialization completed');

    this.logger.info('Init routes');
    await this._initRoutes();
    this.logger.info('Routes initialization completed');

    this.logger.info('Init exception filters');
    await this._initExceptionFilters();
    this.logger.info('Exception filters initialization completed');

    this.logger.info('Try to init server...');
    await this._initServer();
    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
