import * as N from '@nestjs/common';
import * as O from 'otp-generator';
import { OtpAR } from './otp';
import { PeopleView } from '../read-model';

@N.Injectable()
export class OtpStream {
  constructor(@N.Inject('Otp') private readonly Otp: OtpAR) {}

  public async createOtp(people: PeopleView): Promise<string> {
    const otp = new this.Otp({
      _id: people._id,
      otp: O.generate(6, {
        specialChars: false,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        digits: true,
      }),
      createdAt: new Date(),
    });

    await this.Otp.create(otp);
    return otp.otp;
  }

  public async deleteOtp(id: string, otp: string) {
    await this.Otp.deleteOne({ _id: id, otp: otp });
  }
}
