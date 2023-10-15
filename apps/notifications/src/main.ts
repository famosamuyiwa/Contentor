import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { Logger } from 'nestjs-pino';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { NOTIFICATIONS_PACKAGE_NAME, Services } from '@app/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule)
  const configService = app.get(ConfigService)
  app.connectMicroservice({ 
    transport: Transport.GRPC,
    options:{
      package: NOTIFICATIONS_PACKAGE_NAME,
      protoPath: join(__dirname, "../../../../../../proto/notifications.proto"),
      url: configService.getOrThrow('NOTIFICATIONS_GRPC_URL')
    }
  })
  app.useLogger(app.get(Logger))
  await app.startAllMicroservices()
}
bootstrap();
