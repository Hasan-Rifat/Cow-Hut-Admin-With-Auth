import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { USER_ENUM } from '../../../enums/enums';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { Cow } from './../cow/cow.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOrder = async (payload: IOrder): Promise<IOrder | null> => {
  const cowId = payload.cow;
  const buyerId = payload.buyer;

  const cow = await Cow.findById(cowId);
  const buyer = await User.findOne({ _id: buyerId, role: USER_ENUM.BUYER });

  if (!cow) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cow not found');
  }
  if (!buyer) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Buyer account is incorrect!');
  }

  const cowPrice = cow.price;
  let buyerBudget = buyer.budget || 0;

  if (cowPrice > buyerBudget) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Buyer budget is not enough!');
  }

  let orderData;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //1. create the order
    const data = await Order.create([payload], { session });
    orderData = data[0];

    //2. decrease buyer budget
    buyerBudget = buyerBudget - cowPrice;
    await User.findByIdAndUpdate(
      {
        _id: buyerId,
        role: USER_ENUM.BUYER,
      },
      {
        budget: buyerBudget,
      }
    );

    // 3. increase seller income
    const sellerId = cow?.seller;

    await User.findByIdAndUpdate(
      { _id: sellerId, role: USER_ENUM.SELLER },
      { $inc: { income: cowPrice } }
    );

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new ApiError(httpStatus.BAD_REQUEST, error as string);
  }

  if (orderData) {
    orderData = await Order.findById(orderData._id)
      .populate('cow')
      .populate('buyer');
  }

  return orderData;
};

const getOrders = async (): Promise<IOrder[]> => {
  const orders = await Order.find().populate('cow').populate('buyer');
  return orders;
};

const getOrder = async (id: string): Promise<IOrder | null> => {
  // if not found, throw error
  if (!(await Order.findById(id)))
    throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');

  const order = await Order.findById(id).populate('cow').populate('buyer');
  return order;
};

export const orderService = {
  createOrder,
  getOrders,
  getOrder,
};
