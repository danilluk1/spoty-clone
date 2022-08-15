import { ObjectId, Types } from 'mongoose';

export interface UserForToken {
  _id: Types.ObjectId;
  email: string;
}
