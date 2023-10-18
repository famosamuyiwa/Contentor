import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { DatabaseModule, GrpcModule, NOTIFICATIONS_PACKAGE_NAME, NOTIFICATIONS_SERVICE_NAME, UserDocument, UserSchema } from '@app/common';
import { UsersModule } from '../users/users.module';
import { UsersRepository } from '../users/users.repository';
import { OtpDocument, OtpSchema } from '@app/common/models/otp.schema';
import { OtpRepository } from './otp.repository';

@Module({
  imports: [
    UsersModule,
    GrpcModule,
    GrpcModule.registerAsync(NOTIFICATIONS_SERVICE_NAME, 'NOTIFICATIONS_GRPC_URL', NOTIFICATIONS_PACKAGE_NAME),
    DatabaseModule, 
    DatabaseModule.forFeature([{ name: UserDocument.name, schema: UserSchema}, {name: OtpDocument.name, schema: OtpSchema}]),
  ],
  controllers: [OtpController],
  providers: [OtpService, UsersRepository, OtpRepository],
  exports: [OtpService, OtpRepository]
})
export class OtpModule {}
