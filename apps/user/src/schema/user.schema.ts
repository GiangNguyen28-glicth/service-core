import { Model, Schema } from 'mongoose';
import { IUser } from '../interfaces/user';
export class User implements IUser {
  _id?: string;
  username: string;
  password: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export type UserModelType = Model<User>;
export const UserSchema = new Schema<User>(
  {
    username: { type: String, trim: true },
    password: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);
