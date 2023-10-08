import 'reflect-metadata';
import LoggerService from './common/logger/logger.service.js';
import {Component} from './types/component.enum.js';
import Application from './app/application.js';
import {LoggerInterface} from './common/logger/logger.interface.js';
import {ConfigInterface} from './common/config/config.interface.js';
import {ConfigSchema} from './common/config/config.schema.js';
import ConfigService from './common/config/config.service.js';
import {Container} from 'inversify';


const container = new Container();
container.bind<Application>(Component.Application).to(Application).inSingletonScope();
container.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
container.bind<ConfigInterface<ConfigSchema>>(Component.ConfigInterface).to(ConfigService).inSingletonScope();

const application = container.get<Application>(Component.Application);
await application.init();
