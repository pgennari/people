import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import * as M from 'mongoose';
import * as mongodb from 'mongodb';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Events, ReadModel } from './models';

export class ETLWorker extends Server implements CustomTransportStrategy {
  on<
    EventKey extends string = string,
    EventCallback extends Function = Function,
  >(event: EventKey, callback: EventCallback) {
    throw new Error('Method not implemented.');
  }
  unwrap<T>(): T {
    throw new Error('Method not implemented.');
  }
  private RESUME_TOKEN_FILE_PATH = path.resolve('./etl-resume-token.json');
  private conn: M.Connection;
  private changeStream: mongodb.ChangeStream<
    Events.PeopleEvent,
    mongodb.ChangeStreamInsertDocument<Events.PeopleEvent>
  >;
  private resumeToken: object;

  public async listen(callabck: () => void): Promise<void> {
    callabck();
    try {
      if (this.conn?.readyState !== 1) {
        this.conn = (
          await M.connect(`${process.env.MONGODB_URI}`, {
            dbName: `${process.env.MONGODB_DATABASE}`,
            replicaSet: `${process.env.MONGODB_REPLICASET}`,
            serverSelectionTimeoutMS: 5000,
          })
        ).connection;
      }

      await this.watchChanges();

      await this.changeStream.close();
      await this.conn.close();
    } catch (error) {
      console.dir(error);
      await this.sleep(5000);
      return this.listen(callabck);
    }
  }

  public async close(): Promise<void> {
    await this.conn.close();
  }

  public async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async watchChanges(): Promise<void> {
    const peopleStoreCollection =
      this.conn.collection<Events.PeopleEvent>('people-store');
    const peopleViewCollection =
      this.conn.collection<ReadModel.PeopleView>('people-view');

    this.resumeToken = await this.getToken();
    this.changeStream = peopleStoreCollection.watch(
      [{ $match: { operationType: 'insert' } }],
      { startAfter: this.resumeToken },
    );

    for await (const change of this.changeStream) {
      //console.log(change, 'Mongo change event');
      this.resumeToken = change._id as object;
      const event = change.fullDocument;

      // console.log(event, 'Event');
      await peopleViewCollection.updateOne(
        { _id: event.peopleId },
        [
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [
                  '$$ROOT',
                  {
                    name: {
                      $ifNull: [event.data.name, '$name'],
                    },
                    email: {
                      $ifNull: [event.data.email, '$email'],
                    },
                    phoneNumber: {
                      $ifNull: [event.data.phoneNumber, '$phoneNumber'],
                    },
                    socialName: {
                      $ifNull: [event.data.socialName, '$socialName'],
                    },
                    birthDate: {
                      $ifNull: [event.data.birthDate, '$birthDate'],
                    },
                    cpf: {
                      $ifNull: [event.data.cpf, '$cpf'],
                    },
                    createdAt: {
                      $ifNull: [event.data.createdAt, '$createdAt'],
                    },
                    updatedAt: {
                      $ifNull: [event.data.updatedAt, '$updatedAt'],
                    },
                    deletedAt: {
                      $ifNull: [event.data.deletedAt, '$deletedAt'],
                    },
                    verifiedAt: {
                      $ifNull: [event.data.verifiedAt, '$verifiedAt'],
                    },
                  },
                ],
              },
            },
          },
        ],
        { upsert: true },
      );
      await this.saveToken();
    }
    await this.changeStream.close();
  }

  private async saveToken(): Promise<void> {
    await fs.writeFile(
      this.RESUME_TOKEN_FILE_PATH,
      JSON.stringify(this.resumeToken),
    );
  }

  private async getToken(): Promise<object> {
    try {
      return JSON.parse(
        await fs.readFile(this.RESUME_TOKEN_FILE_PATH, 'utf-8'),
      );
    } catch (error) {
      console.dir(error);
    }
  }
}
