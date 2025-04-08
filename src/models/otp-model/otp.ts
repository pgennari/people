import * as M from '@nestjs/mongoose';
import { Model } from 'mongoose';

@M.Schema({
  collection: 'people-otp',
})
export class Otp {
  @M.Prop({ type: String, required: true, immutable: true })
  public readonly _id: string;

  @M.Prop({ type: String })
  public readonly otp: string;

}

export type OtpAR = Model<Otp>;
export const OtpSchema = M.SchemaFactory.createForClass(Otp);
