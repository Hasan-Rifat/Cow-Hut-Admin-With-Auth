import { SortOrder } from 'mongoose';
import paginationHelpers from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { cowSearchableFields } from './cow.constants';
import { ICow, ICowFilterableFields } from './cow.interface';
import { Cow } from './cow.model';

const getAllCows = async (
  paginationOptions: IPaginationOptions,
  searchFilterFields: ICowFilterableFields
): Promise<IGenericResponse<ICow[]>> => {
  // pagination
  const { page, limit, skip } = paginationHelpers(paginationOptions);

  // sort condition
  const sortConditions: { [key: string]: SortOrder } = {};

  // search condition
  const { searchTerm, minPrice, maxPrice, ...filtersData } = searchFilterFields;
  const andConditions = [];

  // search condition
  if (searchTerm) {
    andConditions.push({
      $or: cowSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  // filter condition
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  if (minPrice) {
    andConditions.push({
      price: {
        $gte: minPrice,
      },
    });
  }

  if (maxPrice) {
    andConditions.push({
      price: {
        $lte: maxPrice,
      },
    });
  }

  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const data = await Cow.find(whereConditions)
    .populate('seller')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Cow.countDocuments();
  const meta = { page, limit, total };

  return {
    meta,
    data,
  };
};

const createCow = async (cow: ICow): Promise<ICow> => {
  const result = await Cow.create(cow);

  return result;
};

const singleCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findById(id).populate('seller');
  return result;
};

const updateCow = async (id: string, payload: ICow): Promise<ICow | null> => {
  const result = await Cow.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteCow = async (id: string): Promise<ICow | null> => {
  const result = await Cow.findByIdAndDelete(id);
  return result;
};

export const CowService = {
  getAllCows,
  createCow,
  singleCow,
  updateCow,
  deleteCow,
};
