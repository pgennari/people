import * as N from '@nestjs/common';
import { PeopleEventsStream } from '../events';
import { People } from './people.entity';

@N.Injectable()
export class PeopleRepository {
  constructor(private readonly peopleEventsStream: PeopleEventsStream) {}

  public async fetchOneById(id: string): Promise<People> {
    const lastSnapshot = await this.peopleEventsStream.fetchLastSnapshot(id);
    const newSnapshot = await this.peopleEventsStream.generateSnapshotAfter(
      id,
      lastSnapshot?.version,
    );
    const events = [];
    if (lastSnapshot) events.push(lastSnapshot);
    if (newSnapshot) events.push(newSnapshot);

    if (events.length>0) return new People().replayEvents(events);
  }
}