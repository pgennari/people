import * as M from '@nestjs/mongoose';
import { Model } from 'mongoose';

@M.Schema({
  collection: 'people-view',
})
export class PeopleView {
  @M.Prop({ type: String, required: true, immutable: true })
  public readonly _id: string;

  @M.Prop({ type: String })
  public readonly name: string;

  @M.Prop({ type: String })
  public readonly email: string;

  @M.Prop({ type: String })
  public readonly phoneNumber: string;

  @M.Prop({ type: String })
  public readonly socialName: string;

  @M.Prop({ type: Date })
  public readonly birthDate: Date;

  @M.Prop({ type: String })
  public readonly cpf: string;

  @M.Prop({ type: Date })
  public readonly createdAt: Date;

  @M.Prop({ type: Date })
  public readonly updatedAt: Date;

  @M.Prop({ type: Date })
  public readonly deletedAt: Date;

  @M.Prop({ type: Date })
  public readonly verifiedAt: Date;
}

export type PeopleViewAR = Model<PeopleView>;
export const PeopleViewSchema =
  M.SchemaFactory.createForClass(PeopleView);
