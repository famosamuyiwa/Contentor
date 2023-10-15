import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
    imports: [ClientsModule]
})
export class GrpcModule {
    static registerAsync(serviceName: string, url: string, packageName: string){
        return ClientsModule.registerAsync([
                { 
                name: serviceName,
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options:{
                        package: packageName,
                        protoPath: join(__dirname, `../../../../../../../proto/${packageName}.proto`),
                        url: configService.getOrThrow(url)
                    }
                }),
                inject:[ConfigService]
                }
            ])
        }
}
