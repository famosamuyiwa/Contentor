import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME, DatabaseModule, GrpcModule, LoggerModule } from '@app/common';
import { ReservationRepository } from './reservations.repository';
import { ReservationDocument, ReservationSchema } from './models/reservation.schema';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi'

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
        AUTH_GRPC_URL: Joi.string().required(),
      })
    }),
    GrpcModule,
    GrpcModule.registerAsync(AUTH_SERVICE_NAME, 'AUTH_GRPC_URL', AUTH_PACKAGE_NAME)
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationRepository],
})
export class ReservationsModule {}
