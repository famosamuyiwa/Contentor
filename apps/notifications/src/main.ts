import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { Logger } from 'nestjs-pino';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Services } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule)
  const configService = app.get(ConfigService)
  app.connectMicroservice({ 
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBITMQ_URI')],
      noAck: false,
      queue: Services.NOTIFICATIONS
    }
  })
  app.useLogger(app.get(Logger))
  await app.startAllMicroservices()
}
bootstrap();
