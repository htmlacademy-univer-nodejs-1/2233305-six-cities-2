import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {Component} from '../../types/component.enum.js';
import {Controller} from '../../common/controller/controller.abstract.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http.methods.enum.js';
import {createJWT, fillDTO} from '../../common/helpers/common.js';
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
import {ValidateObjectIdMiddleware} from '../../common/middleware/validate-objectid.middleware.js';
import {UploadFileMiddleware} from '../../common/middleware/upload-file.middleware.js';
import {JWT_ALGORITHM} from '../../common/helpers/consts.js';
import LoggedUserRdo from './rdo/logged-user.rdo.js';
import {BLACK_LIST_TOKENS} from '../../common/middleware/authenticate.middleware.js';
import {PrivateRouteMiddleware} from '../../common/middleware/private-route.middleware.js';


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
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Post,
      handler: this.logout,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
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

  public async login({body}: LoginUserRequest, res: Response): Promise<void> {
    const user = await this
      .userService
      .verifyUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController',
      );
    }

    const token = await createJWT(
      JWT_ALGORITHM,
      this.configService.get('JWT_SECRET'),
      {
        email: user.email,
        id: user.id
      }
    );
    this.ok(res, fillDTO(LoggedUserRdo, {
      email: user.email,
      token
    }));
  }

  public async checkAuthenticate({user: {email}}: Request, res: Response) {
    const foundedUser = await this.userService.findByEmail(email);

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
  }

  public async logout(req: Request, res: Response): Promise<void> {
    const [, token] = String(req.headers.authorization?.split(' '));

    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    BLACK_LIST_TOKENS.add(token);

    this.noContent(res, {token});
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
