import * as N from '@nestjs/common';
import { EventKey, PeopleEvent, PeopleEventsStream } from '../models/events';
import { OnEvent } from '@nestjs/event-emitter';
import { SnsService } from './sns.service';

@N.Injectable()
export class EventsHandlerService {
  constructor(
    private readonly peopleEventsStream: PeopleEventsStream,
    private readonly snsService: SnsService,
  ) {}

  @OnEvent('people.*')
  public async handlePeopleEvents(event: PeopleEvent): Promise<void> {
   //console.log(event, '>>>>Event received<<<<\n\n');
    await this.peopleEventsStream.append(event);
    await this.snsService.publish(event);
  }
}