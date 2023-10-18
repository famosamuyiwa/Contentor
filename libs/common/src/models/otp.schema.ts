import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false})
export class OtpDocument extends AbstractDocument {
    @Prop()
    userId: string

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date
    
    @Prop()
    sentAt?: Date

    @Prop()
    expiredAt?: Date

    @Prop()
    isActive: Boolean
    
    @Prop()
    otp: string

}

export const OtpSchema = SchemaFactory.createForClass(OtpDocument)