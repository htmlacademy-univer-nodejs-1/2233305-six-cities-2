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
  UPLOAD_DIRECTORY: string;
}

export const configSchema = convict<ConfigSchema>({
  PORT: {
    doc: 'Application port for connections',
    format: 'port',
    env: 'PORT',
    default: 4055
  },
  SALT: {
    doc: 'Salt for password hash',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    doc: 'Database host for connection',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  DB_USER: {
    doc: 'Database user for connection',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Database password for connection',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_PORT: {
    doc: 'Database port for connection',
    format: 'port',
    env: 'DB_PORT',
    default: '27017',
  },
  DB_NAME: {
    doc: 'Database name for connection',
    format: String,
    env: 'DB_NAME',
    default: 'buy-and-sell'
  },
  UPLOAD_DIRECTORY: {
    doc: 'Directory for upload files',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: null
  }
});
