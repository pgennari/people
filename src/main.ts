import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupStaticMethods } from './setup';
import { MicroserviceOptions } from '@nestjs/microservices';
import { ETLWorker } from './elt-worker';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupStaticMethods(app);
  app.connectMicroservice<MicroserviceOptions>(
    {
      strategy: new ETLWorker(),
    },
    { inheritAppConfig: true },
  );
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 5000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
