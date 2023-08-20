import { Model, Schema } from 'mongoose';

/* eslint-disable no-unused-vars */
type UserName = {
  firstName: string;
  lastName: string;
};

export type role = 'admin' | 'seller' | 'buyer';

export type IUser = {
  password: string;
  role: role;
  name: UserName;
  phoneNumber: string;
  address: string;
  budget: number;
  income: number;
  _id: Schema.Types.ObjectId;
};

export type UserModel = {
  isUserExist: (
    phoneNumber: string
  ) => Promise<Pick<IUser, 'phoneNumber' | 'password' | 'role' | '_id'>>;
  isPasswordMatched: (
    givenPassword: string,
    savedPassword: string
  ) => Promise<boolean>;
} & Model<IUser>;
