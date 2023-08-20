import express from 'express';
import { USER_ENUM } from '../../../enums/enums';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/middleware';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = express.Router();

router.get(
  '/my-profile',
  auth(USER_ENUM.BUYER, USER_ENUM.SELLER),
  UserController.getMyProfile
);

router.get('/', UserController.getAllUser);
router.get('/:id', auth(USER_ENUM.ADMIN), UserController.getSingleUser);
router.patch('/:id', auth(USER_ENUM.ADMIN), UserController.updateUser);
router.patch(
  '/:id',
  auth(USER_ENUM.BUYER, USER_ENUM.SELLER),
  validateRequest(UserValidation.UpdateUserZodSchema),
  UserController.profileUpdate
);
router.delete('/:id', auth(USER_ENUM.ADMIN), UserController.deleteUser);

export const UserRouter = router;
