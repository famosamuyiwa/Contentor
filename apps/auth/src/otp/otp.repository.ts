import { AbstractRepository, UserDocument } from "@app/common";
import { OtpDocument } from "@app/common/models/otp.schema";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class OtpRepository extends AbstractRepository<OtpDocument>{
    protected readonly logger = new Logger(OtpRepository.name)   

    constructor(@InjectModel(OtpDocument.name) private otpModel: Model<OtpDocument>){
        super(otpModel)
    }

    
  // Method to get the newest record for a specific user
    async getNewestOtpForUser(userId: string) {
        try {
        const newestRecord = await this.otpModel.findOne({ userId })
            .sort({ updatedAt: -1 })
            .exec();
        
        if (newestRecord) {
            return newestRecord;
        } else {
            throw new Error('No records found for the user.');
        }
        } catch (err) {
        throw err; // Handle or log the error as needed
        }
    }
    
}