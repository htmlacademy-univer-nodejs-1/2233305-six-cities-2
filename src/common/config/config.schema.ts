import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type ConfigSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: string;
  DB_NAME: string;
}

export const configSchema = convict<ConfigSchema>({
  PORT: {
    doc: 'Номер порта, на котором приложение ожидает подключений',
    format: 'port',
    env: 'PORT',
    default: 4055
  },
  SALT: {
    doc: 'Соль для хэширования паролей',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    doc: 'Адрес сервера баз данных (валидный IP-адрес)',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  DB_USER: {
    doc: 'Имя пользователя для подключения к базе данных',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Пароль для подключения к базе данных',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_PORT: {
    doc: 'Порт для подключения к базе данных',
    format: 'port',
    env: 'DB_PORT',
    default: '27017',
  },
  DB_NAME: {
    doc: 'Имя базы данных',
    format: String,
    env: 'DB_NAME',
    default: 'buy-and-sell'
  }
});
