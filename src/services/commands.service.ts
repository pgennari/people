import * as N from '@nestjs/common';
import { People, PeopleRepository } from '../models/write-model';
import {
  CreatePeopleCommand,
  UpdatePeopleCommand,
} from '../commands';
import { OtpDAO } from '../models/otp-model';

@N.Injectable()
export class CommandsService {
  constructor(
    private readonly peopleRepo: PeopleRepository,
    private readonly otpDao: OtpDAO,
) {}

  public async getPeople(id: string): Promise<People> {
    const people = await this.peopleRepo.fetchOneById(id);
    if (!people) {
      throw new N.NotFoundException(`People ${id} not found`);
    }
    return people;
  }

  public async createPeople(command: CreatePeopleCommand): Promise<string> {
    const person = new People(command);
    return person.id;
  }

  public async updatePeople(
    id: string,
    command: UpdatePeopleCommand,
  ): Promise<void> {
    const people = await this.peopleRepo.fetchOneById(id);
    if (!people) {
      throw new N.NotFoundException(`People ${id} not found`);
    }
    people.update(command);
  }

  public async deletePeople(id: string): Promise<void> {
    const people = await this.peopleRepo.fetchOneById(id);
    if (!people) {
      throw new N.NotFoundException(`People ${id} not found`);
    }
    people.delete(people);
  }

}
