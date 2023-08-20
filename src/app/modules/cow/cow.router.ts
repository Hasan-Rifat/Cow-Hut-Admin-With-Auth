import express from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/middleware';
import { USER_ENUM } from './../../../enums/enums';
import { CowController } from './cow.controller';
import { CowValidationSchema } from './cow.validation';

const router = express.Router();

router.get(
  '/',
  auth(USER_ENUM.ADMIN, USER_ENUM.BUYER, USER_ENUM.SELLER),
  CowController.getAllCows
);
router.post(
  '/',
  validateRequest(CowValidationSchema.createCowZodSchema),
  CowController.createCow
);
router.get(
  '/:id',
  auth(USER_ENUM.ADMIN, USER_ENUM.BUYER, USER_ENUM.SELLER),
  CowController.singleCow
);
router.patch(
  '/:id',
  auth(USER_ENUM.SELLER),
  validateRequest(CowValidationSchema.updateCowZodSchema),
  CowController.updateCow
);
router.delete('/:id', auth(USER_ENUM.SELLER), CowController.deleteCow);

export const CowRouter = router;
