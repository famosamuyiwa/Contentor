import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ versionKey: false})
export class UserExtDocument extends AbstractDocument {
    @Prop()
    userId: string

    @Prop()
    name: string

    @Prop()
    profilePicture?: string

    @Prop()
    bio?: string

    @Prop()
    occupation?: string

    @Prop()
    website?: string

}

export const UserExtSchema = SchemaFactory.createForClass(UserExtDocument)