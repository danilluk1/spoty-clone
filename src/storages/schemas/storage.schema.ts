import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type StorageDocument = Storage & Document;

@Schema()
export class Storage {
  @Prop({ required: true })
  name: string;

  @Prop()
  author: string;

  @Prop()
  duration: number;

  @Prop({ required: true })
  size: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const StorageSchema = SchemaFactory.createForClass(Storage);
