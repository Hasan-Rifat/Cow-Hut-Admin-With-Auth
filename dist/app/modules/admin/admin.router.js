"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("../../middleware/middleware"));
const admin_controller_1 = require("./admin.controller");
const admin_validation_1 = require("./admin.validation");
const router = express_1.default.Router();
router.post('/create-admin', admin_controller_1.AdminController.createAdmin);
router.post('/login', (0, middleware_1.default)(admin_validation_1.adminValidation.loginZodSchema), admin_controller_1.AdminController.loginAdmin);
router.post('/refresh-token', (0, middleware_1.default)(admin_validation_1.adminValidation.refreshTokenZodSchema), admin_controller_1.AdminController.refreshToken);
exports.AdminRouter = router;
