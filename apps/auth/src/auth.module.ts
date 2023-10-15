import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule, GrpcModule, LoggerModule, NOTIFICATIONS_PACKAGE_NAME, NOTIFICATIONS_SERVICE_NAME, UserDocument, UserSchema } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi'
import { JwtStrategy, LocalStrategy } from './strategy';
import { UsersRepository } from './users/users.repository';

@Module({
  imports: [
    UsersModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        HTTP_PORT: Joi.number().required(),
        NOTIFICATIONS_GRPC_URL: Joi.string().required(),
        AUTH_GRPC_URL: Joi.string().required(),
      })
    }) ,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`
        }
      }),
      inject:[ConfigService]
  }),
  GrpcModule,
  GrpcModule.registerAsync(NOTIFICATIONS_SERVICE_NAME, 'NOTIFICATIONS_GRPC_URL', NOTIFICATIONS_PACKAGE_NAME),
  DatabaseModule, 
  DatabaseModule.forFeature([{ name: UserDocument.name, schema: UserSchema}]),
],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UsersRepository
  ],
})
export class AuthModule {}
