import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import {
  IAdminLogin,
  IAdminLoginResponse,
  IAdmins,
  IAdminsResponse,
} from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (
  payload: IAdmins
): Promise<IAdminsResponse | null> => {
  const result = (await Admin.create(payload)) as IAdminsResponse;

  return {
    _id: result._id,
    phoneNumber: result.phoneNumber,
    role: result.role,
    name: result.name,
    address: result.address,
  };
};

const loginAdmin = async (
  payload: IAdminLogin
): Promise<IAdminLoginResponse> => {
  const { phoneNumber: payloadNumber, password } = payload;

  const isUserExist = await Admin.isAdminExist(payloadNumber);
  // check if user exist
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // check if password match
  if (
    isUserExist.password &&
    !(await Admin?.isPasswordMatched(password, isUserExist?.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  }

  const { _id, role, phoneNumber } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { _id, role, phoneNumber },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { _id, role, phoneNumber },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return { accessToken, refreshToken };
};

const refreshToken = async (
  token: string
): Promise<{
  accessToken: string;
}> => {
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh token');
  }

  const { phoneNumber } = verifiedToken;

  const isAdminExist = await Admin.isAdminExist(phoneNumber);

  // check if user exist
  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // generate new access token
  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isAdminExist._id,
      role: isAdminExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AdminService = {
  createAdmin,
  loginAdmin,
  refreshToken,
};
