import express from 'express';
import { USER_ENUM } from '../../../enums/enums';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/middleware';
import { orderController } from './order.controller';
import { OrderValidation } from './order.validation';

const router = express.Router();

router.get(
  '/',
  auth(USER_ENUM.ADMIN, USER_ENUM.BUYER, USER_ENUM.SELLER),
  orderController.getAllOrders
);
router.post(
  '/',
  auth(USER_ENUM.BUYER),
  validateRequest(OrderValidation.createOrderZodSchema),
  orderController.createOrder
);
router.get(
  '/:id',
  auth(USER_ENUM.ADMIN, USER_ENUM.BUYER, USER_ENUM.SELLER),
  orderController.getOrder
);

export const OrderRouter = router;
