import { Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { EventKey, PeopleEvent } from '../models/events';

@Injectable()
export class SnsService {
  constructor(@Inject('AWSSNS') private readonly sns: AWS.SNS) {}

  async publish(event: PeopleEvent): Promise<void> {
    if (event.key == EventKey.PeopleCreated) {
      const params = {
        Message: JSON.stringify(event),
        TopicArn: process.env.AWS_SNS_TOPIC_ARN,
      };
      try {
        await this.sns.publish(params).promise();
        console.error('Message published to SNS:', params);
      } catch (error) {
        console.error('Error publishing to SNS:', error);
        throw error;
      }
    }
  }
}
