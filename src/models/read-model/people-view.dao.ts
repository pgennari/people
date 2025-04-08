import * as N from '@nestjs/common';
import { PeopleView, PeopleViewAR } from './people-view';
import { FilterQuery } from 'mongoose';

@N.Injectable()
export class PeopleViewDAO {
  constructor(
    @N.Inject('PeopleView') private readonly PeopleView: PeopleViewAR,
  ) {}

  public fetchOneByEmailOrPhoneNumber(
    email: string,
    phoneNumber: string,
  ): Promise<PeopleView> {
    if (email) return this.fetchOneByEmail(email);
    if (phoneNumber) return this.fetchOneByPhoneNumber(phoneNumber);
  }

  public fetchOneByPhoneNumber(phoneNumber: string): Promise<PeopleView> {
    let filter: FilterQuery<PeopleView> = { phoneNumber: phoneNumber };
    return this.PeopleView.findOne(filter);
  }
  
  public fetchOneByEmail(email: string): Promise<PeopleView> {
    let filter: FilterQuery<PeopleView> = { email: email };
    return this.PeopleView.findOne(filter);
  }
  
  public fecthOneById(id: string, showDeleted: boolean): Promise<PeopleView> {
    let filter: FilterQuery<PeopleView> = { _id: id };

    if (showDeleted === false) {
      filter = {
        ...filter,
        deletedAt: { $exists: false },
      };
    }

    return this.PeopleView.findOne(filter);
  }

  public fetchAll(
    skip = 0,
    limit = 0,
    showDeleted: boolean,
  ): Promise<PeopleView[]> {
    let filter: FilterQuery<PeopleView>;
    if (showDeleted === false) {
      filter = {
        ...filter,
        deletedAt: { $exists: false },
      };
    }

    return this.PeopleView.find(filter).skip(skip).limit(limit).lean();
  }
}
