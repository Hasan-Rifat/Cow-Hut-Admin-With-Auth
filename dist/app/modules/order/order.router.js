"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRouter = void 0;
const express_1 = __importDefault(require("express"));
const enums_1 = require("../../../enums/enums");
const auth_1 = __importDefault(require("../../middleware/auth"));
const middleware_1 = __importDefault(require("../../middleware/middleware"));
const order_controller_1 = require("./order.controller");
const order_validation_1 = require("./order.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(enums_1.USER_ENUM.ADMIN, enums_1.USER_ENUM.BUYER, enums_1.USER_ENUM.SELLER), order_controller_1.orderController.getAllOrders);
router.post('/', (0, auth_1.default)(enums_1.USER_ENUM.BUYER), (0, middleware_1.default)(order_validation_1.OrderValidation.createOrderZodSchema), order_controller_1.orderController.createOrder);
router.get('/:id', (0, auth_1.default)(enums_1.USER_ENUM.ADMIN, enums_1.USER_ENUM.BUYER, enums_1.USER_ENUM.SELLER), order_controller_1.orderController.getOrder);
exports.OrderRouter = router;
