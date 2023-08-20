"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const middleware_1 = __importDefault(require("../../middleware/middleware"));
const enums_1 = require("./../../../enums/enums");
const cow_controller_1 = require("./cow.controller");
const cow_validation_1 = require("./cow.validation");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(enums_1.USER_ENUM.ADMIN, enums_1.USER_ENUM.BUYER, enums_1.USER_ENUM.SELLER), cow_controller_1.CowController.getAllCows);
router.post('/', (0, middleware_1.default)(cow_validation_1.CowValidationSchema.createCowZodSchema), cow_controller_1.CowController.createCow);
router.get('/:id', (0, auth_1.default)(enums_1.USER_ENUM.ADMIN, enums_1.USER_ENUM.BUYER, enums_1.USER_ENUM.SELLER), cow_controller_1.CowController.singleCow);
router.patch('/:id', (0, auth_1.default)(enums_1.USER_ENUM.SELLER), (0, middleware_1.default)(cow_validation_1.CowValidationSchema.updateCowZodSchema), cow_controller_1.CowController.updateCow);
router.delete('/:id', (0, auth_1.default)(enums_1.USER_ENUM.SELLER), cow_controller_1.CowController.deleteCow);
exports.CowRouter = router;
