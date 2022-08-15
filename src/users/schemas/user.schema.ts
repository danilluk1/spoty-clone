import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  refreshToken: string;

  @Prop()
  totalTracks: number;

  @Prop()
  isPremium: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
