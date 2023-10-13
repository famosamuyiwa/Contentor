import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule, Services, UserDocument, UserSchema } from '@app/common';
import { UsersRepository } from './users.repository';
import { RabbitMQModule } from '@app/common';


@Module({
  imports: [
    DatabaseModule, 
    DatabaseModule.forFeature([{ name: UserDocument.name, schema: UserSchema}]),
    RabbitMQModule,
    RabbitMQModule.registerAsync(Services.NOTIFICATIONS)
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService]
})
export class UsersModule {}
