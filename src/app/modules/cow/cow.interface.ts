import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type Location =
  | 'Dhaka'
  | 'Chittagong'
  | 'Rajshahi'
  | 'Khulna'
  | 'Barishal'
  | 'Sylhet'
  | 'Rangpur'
  | 'Mymensingh';

export type breed =
  | 'Brahman'
  | 'Nellore'
  | 'Sahiwal'
  | 'Gir'
  | 'Indigenous'
  | 'Tharparkar'
  | 'Kankrej';

export type Label = 'for sale' | 'sold out';

export type Category = 'Dairy' | 'Beef' | 'DualPurpose';

export type ICow = {
  name: string;
  age: number;
  price: number;
  location: Location;
  breed: breed;
  weight: number;
  label: Label;
  category: Category;
  seller: Types.ObjectId | IUser;
};

export type CowModel = Model<ICow, Record<string, unknown>>;

export type ICowFilterableFields = {
  minPrice?: number;
  maxPrice?: string;
  location?: string;
  searchTerm?: string;
  name?: string;
  breed?: string;
  category?: string;
  label?: string;
};
