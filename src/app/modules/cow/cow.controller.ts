import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { cowFilterableFields } from './cow.constants';
import { ICow } from './cow.interface';
import { CowService } from './cow.service';

const getAllCows = catchAsync(async (req: Request, res: Response) => {
  // pagination
  const paginationOptions = pick(req.query, paginationFields);
  // filter
  const searchFilterFields = pick(req.query, cowFilterableFields);

  const result = await CowService.getAllCows(
    paginationOptions,
    searchFilterFields
  );

  sendResponse<ICow[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'all cow get successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const createCow = catchAsync(async (req: Request, res: Response) => {
  const cow = await CowService.createCow(req.body);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Cow created successfully !',
    data: cow,
  });
});

const singleCow = catchAsync(async (req: Request, res: Response) => {
  const cow = await CowService.singleCow(req.params.id);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow get successfully !',
    data: cow,
  });
});

const updateCow = catchAsync(async (req: Request, res: Response) => {
  const cow = await CowService.updateCow(req.params.id, req.body);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow updated successfully !',
    data: cow,
  });
});

const deleteCow = catchAsync(async (req: Request, res: Response) => {
  await CowService.deleteCow(req.params.id);

  sendResponse<ICow>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cow deleted successfully !',
  });
});

export const CowController = {
  getAllCows,
  createCow,
  singleCow,
  updateCow,
  deleteCow,
};
