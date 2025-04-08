import { EventKey, PeopleEvent, PeopleEventArgs } from '../events';

export type PeopleCreatedArgs = Omit<PeopleEventArgs, 'key'>;

export class PeopleCreated extends PeopleEvent {
  constructor(args: PeopleCreatedArgs) {
    super({
      ...args,
      key: EventKey.PeopleCreated,
      data: { 
        ...args.data,
        createdAt: new Date(),
      },
    });
  }
}
