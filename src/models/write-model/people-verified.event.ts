import { EventKey, PeopleEvent, PeopleEventArgs } from '../events';

export type PeopleVerifiedArgs = Omit<PeopleEventArgs, 'key'>;

export class PeopleVerified extends PeopleEvent {
  constructor(args: PeopleVerifiedArgs) {
    super({
      ...args,
      key: EventKey.PeopleVerified,
      data: { verifiedAt: new Date() },
    });
  }
}
