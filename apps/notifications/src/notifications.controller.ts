import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotifyEmailDto } from '../dto/notify-email-dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}


  @UsePipes(new ValidationPipe)
  @EventPattern('notify_email')
  async notifyEmail(@Payload() data: NotifyEmailDto, @Ctx() context: RmqContext){
    
    //context to manually acknowledge message in case of error of logic purposes
    const channel = context.getChannelRef()
    const originalMsg = context.getMessage()
    
    channel.ack(originalMsg)

    this.notificationsService.notifyEmail(data)
  }

}
