import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  });

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors({
    origin: [
      "https://portal.sistemapay.com.br",
      "http://localhost:5173"
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE, HEAD, PATCH, OPTIONS'],
    credentials: true,
    allowedHeaders: '*'
  });

  await app.listen(8080)
  .then(() => console.log(`Application is running on port: 8080`));
}
bootstrap();
