import * as N from '@nestjs/common';
import * as lodash from 'lodash';
import { PeopleEvent, PeopleEventAR } from './people.event';

@N.Injectable()
export class PeopleEventsStream {
  constructor(
    @N.Inject('PeopleEvent') private readonly PeopleEvent: PeopleEventAR,
  ) {}

  public fetchLastSnapshot(peopleId: string): Promise<PeopleEvent> {
    return this.PeopleEvent.findOne({ peopleId, isSnapshot: true })
      .sort({
        timestamp: -1 
      })
      .lean();
  }

  public async generateSnapshot(peopleId: string): Promise<PeopleEvent> {
    const events = await this.runPipeline(peopleId);
    return events?.at(0);
  }

  public async generateSnapshotAfter(
    peopleId: string,
    version: number,
  ): Promise<PeopleEvent> {
    const events = await this.runPipeline(peopleId, version);
    return events?.at(0);
  }

  public async append(event: PeopleEvent): Promise<void> {
    const shouldBeSnapshot = event.version % 3 === 0;

    if(shouldBeSnapshot) {
      const lastSnapshot = await this.fetchLastSnapshot(event.peopleId);
      const newSnapshot = await this.generateSnapshotAfter(
        event.peopleId,
        lastSnapshot?.version,
      );
      this.merge(newSnapshot, event);
    }
    await this.PeopleEvent.create(event);
  }

  public runPipeline(
    peopleId: string,
    version?: number,
  ): Promise<PeopleEvent[]> {
    return this.PeopleEvent.aggregate([
      {
        $match: {
          peopleId,
          ...(version && { version: { $gte: version } }),
        },
      },
      {
        $sort: {
          timestamp: 1,
        },
      },
      {
        $group: {
          _id: '$id',
          key: { $first: '$key' },
          peopleId: { $first: '$peopleId' },
          data: { $mergeObjects: '$data' },
          version: { $last: '$version' },
        },
      },
      {
        $unset: '_id',
      },
    ]).exec();
  }

  private merge(snapshot: PeopleEvent, event: PeopleEvent): void {
    const cleanEventData = lodash.omitBy(event.data, (value) => value === undefined);
    Object.assign(event, {
      isSnapshot: true,
      data: lodash.merge({}, snapshot.data, cleanEventData)
    }); 
  }
}
