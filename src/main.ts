import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';

async function bootstrap() {

  const logger = new Logger('Payment-ms')
  const app = await NestFactory.create(AppModule);
  await app.listen(envs.port);
  logger.log(`Payments MS running on ${envs.port}`)
}
bootstrap();
