import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../../app.module';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@codegenie/serverless-express';
import express from 'express';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const expressApp = express();
  const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  await nestApp.init();

  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  server = server ?? (await bootstrap());

  console.log("BODY:")
  console.log(event.body);
  return "Hello from serverless function!";
  // return server(event, context, callback);
};
