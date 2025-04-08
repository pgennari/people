import * as N from '@nestjs/common';
import { WriteModel } from './models';
import { EventEmitter2 } from '@nestjs/event-emitter';

export const setupStaticMethods = (app: N.INestApplication): void => {
  WriteModel.People.eventEmitter = app.get<EventEmitter2>(EventEmitter2);
};
