import * as N from '@nestjs/common';
import { OtpDAO, OtpStream } from '../models/otp-model';
import { PeopleRepository } from '../models/write-model';
import { MailService } from './mail.service';
import * as jwt from 'jsonwebtoken';
import { PeopleViewDAO } from '../models/read-model';

@N.Injectable()
export class AuthService {
  private readonly secretKey: string;
  private readonly expiresIn: string;

  constructor(
    private readonly peopleViewDAO: PeopleViewDAO,
    private readonly peopleRepo: PeopleRepository,
    private readonly mailService: MailService,
    private readonly otpStream: OtpStream,
    private readonly otpDao: OtpDAO,
  ) {
    this.secretKey = process.env.JWT_SECRET; // Replace 'your-secret-key' with a strong secret key
    this.expiresIn = process.env.JWT_EXPIRES_IN || '1h'; // Default expiration time is 1 hour
  }

  public async sendOTP(email: string, phoneNumber: string): Promise<void> {
    const people = await this.peopleViewDAO.fetchOneByEmailOrPhoneNumber(
      email,
      phoneNumber,
    );
    if (!people) {
      throw new N.NotFoundException(`E-mail or phone number not found`);
    }

    const otpRecord = await this.otpDao.fecthOneById(people._id);
    if (otpRecord)
      await this.otpStream.deleteOtp(otpRecord._id, otpRecord.otp);

    const otp = await this.otpStream.createOtp(people);

    await this.mailService.sendEmail({
      emailTo: people.email,
      subject: 'Acesso ao Acordemus',
      template: 'signup-confirmation-email',
      context: {
        name: people.name,
        otp: otp,
      },
    });
  }

  public async verifyOtp(id: string, otp: string): Promise<void> {
    const otpRecord = await this.otpDao.fecthOneByOTP(otp);
    if (!otpRecord) {
      throw new N.NotFoundException(`OTP ${otp} not found`);
    }

    const people = await this.peopleRepo.fetchOneById(otpRecord._id);
    if (!people) {
      throw new N.NotFoundException(`People ${otpRecord._id} not found`);
    }

    people.verify(people);
    await this.otpStream.deleteOtp(otpRecord._id, otp);
  }

  public async generateJwt(id: string): Promise<string> {
    const payload = { 
      sub: id 
    }; // 'sub' (subject) is a common claim for the user ID

    const token = jwt.sign(payload, this.secretKey, {
      expiresIn: this.expiresIn,
    });

    return token;
  }

  public verifyToken(token: string): any {
    try {
      const decoded = jwt.verify(token, this.secretKey);
      return decoded;
    } catch (error) {
      // Handle token verification errors (e.g., token expired, invalid signature)
      console.error('JWT verification failed:', error);
      return null; // Or throw an exception if you prefer
    }
  }
}
