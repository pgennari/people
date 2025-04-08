import { EventKey, PeopleEvent, PeopleEventArgs } from '../events';

export type PeopleUpdatedArgs = Omit<PeopleEventArgs, 'key'>;

export class PeopleUpdated extends PeopleEvent {
  constructor(args: PeopleUpdatedArgs) {
    super({
      ...args,
      key: EventKey.PeopleUpdated,
      data: { ...args.data, updatedAt: new Date() },
    });
  }
}
