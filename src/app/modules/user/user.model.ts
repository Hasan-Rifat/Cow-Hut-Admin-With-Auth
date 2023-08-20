/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { role } from './user.constants';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    password: { type: String, required: true },
    role: {
      required: true,
      type: String,
      enum: role,
    },
    name: {
      required: true,
      type: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
      },
    },
    phoneNumber: { type: String, required: true },
    address: {
      required: true,
      type: String,
    },
    budget: {
      required: true,
      type: Number,
    },
    income: {
      required: true,
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.statics.isUserExist = async function (
  phoneNumber: string
): Promise<Pick<IUser, 'phoneNumber' | 'password' | 'role' | '_id'> | null> {
  return await User.findOne(
    { phoneNumber },
    {
      phoneNumber: 1,
      password: 1,
      role: 1,
      _id: 1,
    }
  );
};

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.pre('save', async function (next) {
  // hash user password
  const user = this;
  user.password = await bcrypt.hash(user.password, Number(config.SALT_ROUND));
  next();
});

export const User = model<IUser, UserModel>('User', userSchema);
