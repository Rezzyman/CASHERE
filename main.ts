import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors({ origin: process.env.WEB_ORIGIN?.split(',') || true }));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = process.env.PORT || 4000;
  await app.listen(port as number);
  console.log(`Cashere API running on http://localhost:${port}`);
  console.log(`Locker provider: ${process.env.LOCKER_PROVIDER || 'virtual'}`);
  console.log(`Auto-accept after: ${process.env.AUTO_ACCEPT_MS || '60000'} ms`);
}
bootstrap();
