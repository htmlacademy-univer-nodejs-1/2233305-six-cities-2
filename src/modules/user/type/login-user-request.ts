import {Request} from 'express';
import {RequestBody, RequestParams} from '../../../common/http/requests.js';
import LoginUserDto from '../dto/login-user.dto.js';

export type LoginUserRequest = Request<RequestParams, RequestBody, LoginUserDto>;
