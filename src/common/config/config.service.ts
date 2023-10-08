import { ConfigInterface } from './config.interface.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import {config} from 'dotenv';
import {configSchema, ConfigSchema} from './config.schema.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/component.enum.js';

@injectable()
export default class ConfigService implements ConfigInterface<ConfigSchema> {
  private readonly config: ConfigSchema;

  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface
  ) {
    const configOutput = config();

    if (configOutput.error) {
      throw new Error('Ошибка при чтении .env файла');
    }

    configSchema.load({});
    configSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configSchema.getProperties();
    this.logger.info('.env файл успешно найден');
  }

  public get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T] {
    return this.config[key];
  }
}
