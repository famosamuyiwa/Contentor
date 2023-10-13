import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule, LoggerModule } from '@app/common';
import { ReservationRepository } from './reservations.repository';
import { ReservationDocument, ReservationSchema } from './models/reservation.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi'
import { Services } from '@app/common';
import { RabbitMQModule } from '@app/common';

@Module({
  imports: [
    DatabaseModule, 
    DatabaseModule.forFeature([{ name: ReservationDocument.name, schema: ReservationSchema}]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBITMQ_URI: Joi.string().required()
      })
    }),
    RabbitMQModule,
    RabbitMQModule.registerAsync(Services.AUTH)
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationRepository],
})
export class ReservationsModule {}
