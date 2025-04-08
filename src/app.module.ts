import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CommandsService } from './services/commands.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { QueriesService } from './services/queries.service';
import { Events, ReadModel, WriteModel, OtpModel } from './models';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsHandlerService } from './services/events-handler.service';
import { MailService } from './services/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { AuthService } from './services/auth.service';
import * as AWS from 'aws-sdk';
import { SnsService } from './services/sns.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`${process.env.MONGODB_URI}`, {
      dbName: `${process.env.MONGODB_DATABASE}`,
      replicaSet: `${process.env.MONGODB_REPLICASET}`,
    }),
    MongooseModule.forFeature([
      {
        name: Events.PeopleEvent.name,
        schema: Events.PeopleEventSchema,
      },
      {
        name: ReadModel.PeopleView.name,
        schema: ReadModel.PeopleViewSchema,
      },
      {
        name: OtpModel.Otp.name,
        schema: OtpModel.OtpSchema,
      },
    ]),
    EventEmitterModule.forRoot({ wildcard: true }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST,
          port: +process.env.SMTP_PORT,
          secure: false,
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: process.env.FROM,
        },
        template: {
          dir: __dirname + '/../templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    MailService,
    Events.PeopleEventsStream,
    WriteModel.PeopleRepository,
    ReadModel.PeopleViewDAO,
    OtpModel.OtpStream,
    OtpModel.OtpDAO,
    EventsHandlerService,
    CommandsService,
    QueriesService,
    AuthService,
    SnsService,
    {
      provide: 'PeopleEvent',
      useFactory: (model) => model,
      inject: [getModelToken(Events.PeopleEvent.name)],
    },
    {
      provide: 'PeopleView',
      useFactory: (model) => model,
      inject: [getModelToken(ReadModel.PeopleView.name)],
    },
    {
      provide: 'Otp',
      useFactory: (model) => model,
      inject: [getModelToken(OtpModel.Otp.name)],
    },
    {
      provide: 'AWSSNS',
      useFactory: () => {
        AWS.config.update({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION,
        });
        return new AWS.SNS();
      },
    },
  ],
})
export class AppModule {}
