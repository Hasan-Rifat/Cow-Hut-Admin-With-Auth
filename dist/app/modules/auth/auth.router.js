"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("../../middleware/middleware"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.post('/signup', (0, middleware_1.default)(auth_validation_1.AuthValidationSchema.CreateUserZodSchema), auth_controller_1.AuthController.createUser);
router.post('/login', (0, middleware_1.default)(auth_validation_1.AuthValidationSchema.LoginUserZodSchema), auth_controller_1.AuthController.loginUser);
router.post('/refresh-token', (0, middleware_1.default)(auth_validation_1.AuthValidationSchema.refreshTokenZodSchema), auth_controller_1.AuthController.refreshToken);
exports.AuthRouter = router;
