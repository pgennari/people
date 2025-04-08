import * as N from '@nestjs/common';
import { Otp, OtpAR } from './otp';

@N.Injectable()
export class OtpDAO {
  constructor(@N.Inject('Otp') private readonly Otp: OtpAR) {}

  public fecthOneByOTP(otp: string): Promise<Otp> {
    return this.Otp.findOne({ otp: otp }).lean();
  }
  public fecthOneById(id: string): Promise<Otp> {
    return this.Otp.findOne({ _id: id }).lean();
  }
}
