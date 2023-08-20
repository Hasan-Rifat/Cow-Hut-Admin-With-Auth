import { Model, Schema } from 'mongoose';
import { role } from '../user/user.interface';
/* eslint-disable no-unused-vars*/

export type UserName = {
  firstName: string;
  lastName: string;
};

export type IAdmins = {
  _id: Schema.Types.ObjectId;
  phoneNumber: string;
  role: role;
  password: string;
  name: UserName;
  address: string;
};

export type IAdminsResponse = {
  _id: Schema.Types.ObjectId;
  phoneNumber: string;
  role: role;
  name: UserName;
  address: string;
};

export type IAdminLogin = {
  phoneNumber: string;
  password: string;
};

export type IAdminLoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type AdminModel = {
  create(payload: IAdmins): unknown;
  findOne(
    arg0: { phoneNumber: string },
    arg1: { phoneNumber: number; password: number; role: number }
  ):
    | Pick<IAdmins, '_id' | 'phoneNumber' | 'role' | 'password'>
    | PromiseLike<Pick<
        IAdmins,
        '_id' | 'phoneNumber' | 'role' | 'password'
      > | null>
    | null;
  isAdminExist(
    phoneNumber: string
  ): Promise<Pick<IAdmins, 'phoneNumber' | 'password' | 'role' | '_id'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean> & Model<IAdmins>;
};
