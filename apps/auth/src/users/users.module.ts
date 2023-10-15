import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule, GrpcModule, NOTIFICATIONS_PACKAGE_NAME, NOTIFICATIONS_SERVICE_NAME, Services, UserDocument, UserSchema } from '@app/common';
import { UsersRepository } from './users.repository';


@Module({
  imports: [
    DatabaseModule, 
    DatabaseModule.forFeature([{ name: UserDocument.name, schema: UserSchema}]),
    GrpcModule,
    GrpcModule.registerAsync(NOTIFICATIONS_SERVICE_NAME, 'NOTIFICATIONS_GRPC_URL', NOTIFICATIONS_PACKAGE_NAME)
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService]
})
export class UsersModule {}
