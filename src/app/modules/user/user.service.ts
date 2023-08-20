/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IUser } from './user.interface';
import { User } from './user.model';

const getAllUser = (): Promise<IUser[]> => {
  const data = User.where({});
  return data;
};

const getSingleUser = (id: string): Promise<IUser | null> => {
  const data = User.findById(id);
  return data;
};

const updateUser = (id: string, payload: IUser): Promise<IUser | null> => {
  const data = User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return data;
};

const deleteUser = (id: string): Promise<IUser | null> => {
  const data = User.findByIdAndDelete(id);
  return data;
};

const getMyProfile = async (
  userId: string | undefined
): Promise<IUser | null> => {
  const result = await User.findById({
    _id: userId,
  });

  return result;
};

const profileUpdate = async (
  userId: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await User.findById({ _id: userId });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const { name, ...userData } = payload;

  const updateUser: Partial<IUser> = {
    ...userData,
  };

  // dynamic update name
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>;
      (updateUser as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await User.findByIdAndUpdate({ _id: userId }, updateUser, {
    new: true,
  });

  return result;
};

export const UserService = {
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
  getMyProfile,
  profileUpdate,
};
