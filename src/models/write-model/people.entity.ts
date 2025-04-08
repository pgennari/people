import { EventEmitter2 } from '@nestjs/event-emitter';
import * as crypto from 'crypto';
import { PeopleEvent } from '../events';
import { PeopleCreated } from './people-created.event';
import { PeopleUpdated } from './people-updated.event';
import { PeopleDeleted } from './people-deleted.event';
import { PeopleVerified } from './people-verified.event';

export type PeopleArgs = {
  name?: string;
  email?: string;
  phoneNumber?: string;
  socialName?: string;
  birthDate?: Date;
  cpf?: string;
};

export class People {
  public id: string;
  public name: string;
  public email: string;
  public phoneNumber: string;
  public socialName: string;
  public birthDate: Date;
  public cpf: string;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date;
  public version = 0;
  public verifiedAt: Date;

  public static eventEmitter: EventEmitter2;

  constructor(args?: PeopleArgs) {
    if (args)
      this.applyEvents([
        new PeopleCreated({
          peopleId: crypto.randomUUID(),
          data: {
            name: args.name,
            email: args.email,
            phoneNumber: args.phoneNumber,
          },
        }),
      ]);
  }

  public update(args: PeopleArgs): void {
    this.applyEvents([
      new PeopleUpdated({
        peopleId: this.id,
        data: {
          name: args.name,
          email: args.email,
          phoneNumber: args.phoneNumber,
          socialName: args.socialName,
          birthDate: args.birthDate,
          cpf: args.cpf,
          updatedAt: new Date(),
        },
        version: this.version,
      }),
    ]);
  }

  public delete(args: PeopleArgs): void {
    this.applyEvents([
      new PeopleDeleted({
        peopleId: this.id,
        data: {
          deletedAt: new Date(),
        },
        version: this.version,
      }),
    ]);
  }

  public verify(args: PeopleArgs): void {
    this.applyEvents([
      new PeopleVerified({
        peopleId: this.id,
        data: {
          verifiedAt: new Date(),
        },
        version: this.version,
      }),
    ]);
  }

  public applyEvents(events: PeopleEvent[]): this {
    events.forEach((e) => {
      this.merge(e);
      People.eventEmitter.emit(e.key, e);
    });
    return this;
  }

  public replayEvents(events: PeopleEvent[]): this {
    events.forEach((e) => {
      this.merge(e);
    });
    return this;
  }

  private merge(event: PeopleEvent): void {
    const { peopleId: id, data, ...root } = event;
    Object.assign(this, { id, ...data, ...root });
  }
}
