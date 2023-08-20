import express from 'express';
import validateRequest from '../../middleware/middleware';
import { AdminController } from './admin.controller';
import { adminValidation } from './admin.validation';

const router = express.Router();

router.post('/create-admin', AdminController.createAdmin);
router.post(
  '/login',
  validateRequest(adminValidation.loginZodSchema),
  AdminController.loginAdmin
);

router.post(
  '/refresh-token',
  validateRequest(adminValidation.refreshTokenZodSchema),
  AdminController.refreshToken
);

export const AdminRouter = router;
