import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {Component} from '../../types/component.enum.js';
import {Controller} from '../../common/controller/controller.abstract.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http.methods.enum.js';
import {fillDTO} from '../../common/helpers/common.js';
import {UserServiceInterface} from './user-service.interface.js';
import {HttpError} from '../../common/http/http.errors.js';
import {StatusCodes} from 'http-status-codes';
import {ConfigInterface} from '../../common/config/config.interface.js';
import {ConfigSchema} from '../../common/config/config.schema.js';
import UserRdo from './rdo/user.rdo.js';
import LoginUserDto from './dto/login-user.dto.js';
import {ValidateDtoMiddleware} from '../../common/middleware/validate-dto.middleware.js';
import {CreateUserRequest} from './type/create-user-request.js';
import {LoginUserRequest} from './type/login-user-request.js';
import CreateUserDto from './dto/create-user.dto.js';


@injectable()
export default class UserController extends Controller {
  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface,
              @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
              @inject(Component.ConfigInterface) private readonly configService: ConfigInterface<ConfigSchema>
  ) {
    super(logger);

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateUserDto)
      ]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new ValidateDtoMiddleware(LoginUserDto)
      ]
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Post,
      handler: this.logout
    });
  }

  public async create({body}: CreateUserRequest, res: Response,): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} already exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(
      res,
      fillDTO(UserRdo, result)
    );
  }

  public async login({body}: LoginUserRequest, _res: Response,): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async logout(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }
}
