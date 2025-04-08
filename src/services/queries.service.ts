import * as N from '@nestjs/common';
import { ReadModel } from '../models';
import { GetAllPeopleViewQuery } from '../queries';

@N.Injectable()
export class QueriesService {
  constructor(private readonly PeopleViewDAO: ReadModel.PeopleViewDAO) {}

  public async fetchAllPeople(
    query: GetAllPeopleViewQuery,
  ): Promise<ReadModel.PeopleView[]> {
    return this.PeopleViewDAO.fetchAll(query.skip, query.limit, query.showDeleted);
  }

  public async fetchOnePerson(
    id: string,
    showDeleted: boolean,
  ): Promise<ReadModel.PeopleView> {
    const person = await this.PeopleViewDAO.fecthOneById(id, showDeleted);
    if (!person) {
      throw new N.NotFoundException(`Person ${id} not found`);
    }
    return person;
  }
}
