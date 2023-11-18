import { injectable } from 'inversify';
import { vi } from 'vitest';
import {UserServiceInterface} from '../user-service.interface';

@injectable()
export default class MockUserService implements UserServiceInterface {
  public create = vi.fn();
  public findByEmail = vi.fn();
  public findOrCreate = vi.fn();
  public addToFavoritesById = vi.fn();
  public findById = vi.fn();
  public findFavorites = vi.fn();
  public removeFromFavoritesById = vi.fn();
}
