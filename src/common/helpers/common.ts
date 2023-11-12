import * as crypto from 'node:crypto';
import {ClassConstructor, plainToInstance} from 'class-transformer';
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export const getConnectionString = (
  username: string,
  password: string,
  host: string,
  port: string,
  databaseName: string,
): string => `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=admin`;

export const createSHA256 = (line: string, salt: string): string => {
  const hashed = crypto.createHmac('sha256', salt);
  return hashed.update(line).digest('hex');
};

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
}

export function createErrorObject(message: string) {
  return {
    error: message,
  };
}
