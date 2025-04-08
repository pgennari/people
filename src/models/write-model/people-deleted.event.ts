import { EventKey, PeopleEvent, PeopleEventArgs } from '../events';

export type PeopleDeletedArgs = Omit<PeopleEventArgs, 'key'>;

export class PeopleDeleted extends PeopleEvent {
  constructor(args: PeopleDeletedArgs) {
    super({
      ...args,
      key: EventKey.PeopleDeleted,
      data: { deletedAt: new Date() },
    });
  }
}
