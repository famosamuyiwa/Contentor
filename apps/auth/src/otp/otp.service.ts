import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { GenerateOTP, NOTIFICATIONS_SERVICE_NAME, NotificationsServiceClient } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { SendOtpDTO } from './dto';
import { CreateOtpDTO } from './dto/create-otp.dto';
import { OtpRepository } from './otp.repository';
import { EditOtpDTO } from './dto/edit-otp.dto';
import { ValidateOtpDTO } from './dto/validate-otp.dto';

@Injectable()
export class OtpService implements OnModuleInit{
    private notificationsService: NotificationsServiceClient

    constructor(
      private readonly usersRepository: UsersRepository,
      private readonly otpRepository: OtpRepository,
      @Inject(NOTIFICATIONS_SERVICE_NAME)private readonly client: ClientGrpc
      ){}

    onModuleInit() {
        this.notificationsService = this.client.getService<NotificationsServiceClient>(NOTIFICATIONS_SERVICE_NAME)
    }
    
    async createOTP(createOtpDTO: CreateOtpDTO){
        return this.otpRepository.create({
            ...createOtpDTO,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: false
        })
    }

    async updateOTP(_id: string, editOtpDTO: EditOtpDTO){
        return this.otpRepository.findOneAndUpdate(
            {_id},
            {$set: editOtpDTO}
        )
    }

    async validateOTP(validateOtpDTO: ValidateOtpDTO, userId: string){
        const otp = await this.otpRepository.getNewestOtpForUser(userId)
        
        console.log(otp)
        if(otp.isActive){
            //throw error if otp has exceeded expiry date
            if(otp.expiredAt < new Date()){
                throw new BadRequestException('Otp has expired')
            }
            //check if otp supplied matches latest otp for that user
            if(otp.otp === validateOtpDTO.otp){

                //change active status to avoid it being reused
                const updatedOtp = await this.updateOTP((otp._id).toString(), {
                    updatedAt: new Date(),
                    isActive: false
                })
                return updatedOtp
            }
            else{
                throw new BadRequestException('Otp is invalid')
            }
        }

        throw new BadRequestException('Otp is invalid or inactive')
    }

    async sendOTP(sendOtpDTO: SendOtpDTO){

        //check if user exists, create otp, then send otp
        try{
            const user = await this.usersRepository.findOne({email: sendOtpDTO.email})
            const otp =   GenerateOTP(5)
            
            const createdOtp = await this.createOTP({
                userId: (user._id).toString(),  //convert _id objectid to string
                otp
            })

            this.notificationsService
            .notifyEmail({email: sendOtpDTO.email, text:`Your OTP is: ${otp}`})
            .subscribe(() => {})

            //add n minutes to current date for otp expiry 
            const currentDate = new Date();
            currentDate.setMinutes(currentDate.getMinutes() + 5);

            //update created otp after mail has been sent
            const updatedOtp = await this.updateOTP((createdOtp._id).toString(), {
                updatedAt: new Date(),
                sentAt: new Date(),
                expiredAt: currentDate,
                isActive: true
            })

            return updatedOtp
        }
        catch(err){
            throw new BadRequestException(err)
        }
    }

}
