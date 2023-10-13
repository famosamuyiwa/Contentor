import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Services } from '../enums';

@Module({
    imports: [ClientsModule]
})
export class RabbitMQModule {
    static registerAsync(service: Services){
        return ClientsModule.registerAsync([
                { 
                name: service,
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options:{
                    urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
                    queue: service
                    }
                }),
                inject:[ConfigService]
                }
            ])
        }
}
