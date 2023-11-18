import { injectable } from 'inversify';
import { vi } from 'vitest';
import {OfferServiceInterface} from '../offer-service.interface.js';


@injectable()
export default class MockOfferService implements OfferServiceInterface {
  public deleteById = vi.fn();
  public exists = vi.fn();
  public find = vi.fn();
  public findPremiumByCity = vi.fn();
  public incComment = vi.fn();
  public updateById = vi.fn();
  public updateRating = vi.fn();
  public create = vi.fn();
  public findById = vi.fn();
}
