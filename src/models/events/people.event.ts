import * as M from '@nestjs/mongoose';
import { EventKey } from './event-key.enum';
import { Model } from 'mongoose';

export type PeopleEventArgs = {
  key: EventKey;
  isSnapshot?: boolean;
  peopleId: string;
  data: PeopleData;
  timestamp?: Date;
  version?: number;
};

@M.Schema({ _id: false })
class PeopleData {
  @M.Prop({
    type: String,
    immutable: true,
  })
  public name?: string;
  @M.Prop({
    type: String,
    immutable: true,
  })
  public email?: string;
  @M.Prop({
    type: String,
    immutable: true,
  })
  public phoneNumber?: string;
  @M.Prop({
    type: String,
    immutable: true,
  })
  public socialName?: string;
  @M.Prop({
    type: Date,
    immutable: true,
  })
  public birthDate?: Date;
  @M.Prop({
    type: String,
    immutable: true,
  })
  public cpf?: string;
  @M.Prop({
    type: Date,
    immutable: true,
  })
  public createdAt?: Date;
  @M.Prop({
    type: Date,
    immutable: true,
  })
  public updatedAt?: Date;
  @M.Prop({
    type: Date,
    immutable: true,
  })
  public deletedAt?: Date;
  @M.Prop({
    type: Date,
    immutable: true,
  })
  public verifiedAt?: Date;
}
const PeopleDataSchema = M.SchemaFactory.createForClass(PeopleData);

@M.Schema({ collection: 'people-store' })
export class PeopleEvent {
  @M.Prop({
    type: String,
    enum: EventKey,
    required: true,
    immutable: true,
  })
  public key: EventKey;

  @M.Prop({
    type: Boolean,
    required: true,
    immutable: true,
  })
  public isSnapshot = false;

  @M.Prop({
    type: String,
    required: true,
    immutable: true,
  })
  public peopleId: string;

  @M.Prop({
    type: PeopleDataSchema,
    required: true,
    immutable: true,
  })
  public data: PeopleData;

  @M.Prop({
    type: Date,
    required: true,
    immutable: true,
  })
  public timestamp = new Date();

  @M.Prop({
    type: Number,
    required: true,
    immutable: true,
  })
  public version = 0;

  constructor(args?: PeopleEventArgs) {
    Object.assign(this, { ...args, version: args?.version ?? 0 });
    this.version += 1;
  }
}

export type PeopleEventAR = Model<PeopleEvent>;
export const PeopleEventSchema = M.SchemaFactory.createForClass(
  PeopleEvent,
).index({ peopleId: 1, isSnapshot: 1, timestamp: -1 });
