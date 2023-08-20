"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const enums_1 = require("../../../enums/enums");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("../user/user.model");
const cow_model_1 = require("./../cow/cow.model");
const order_model_1 = require("./order.model");
const createOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const cowId = payload.cow;
    const buyerId = payload.buyer;
    const cow = yield cow_model_1.Cow.findById(cowId);
    const buyer = yield user_model_1.User.findOne({ _id: buyerId, role: enums_1.USER_ENUM.BUYER });
    if (!cow) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Cow not found');
    }
    if (!buyer) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Buyer account is incorrect!');
    }
    const cowPrice = cow.price;
    let buyerBudget = buyer.budget || 0;
    if (cowPrice > buyerBudget) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Buyer budget is not enough!');
    }
    let orderData;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //1. create the order
        const data = yield order_model_1.Order.create([payload], { session });
        orderData = data[0];
        //2. decrease buyer budget
        buyerBudget = buyerBudget - cowPrice;
        yield user_model_1.User.findByIdAndUpdate({
            _id: buyerId,
            role: enums_1.USER_ENUM.BUYER,
        }, {
            budget: buyerBudget,
        });
        // 3. increase seller income
        const sellerId = cow === null || cow === void 0 ? void 0 : cow.seller;
        yield user_model_1.User.findByIdAndUpdate({ _id: sellerId, role: enums_1.USER_ENUM.SELLER }, { $inc: { income: cowPrice } });
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, error);
    }
    if (orderData) {
        orderData = yield order_model_1.Order.findById(orderData._id)
            .populate('cow')
            .populate('buyer');
    }
    return orderData;
});
const getOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.Order.find().populate('cow').populate('buyer');
    return orders;
});
const getOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // if not found, throw error
    if (!(yield order_model_1.Order.findById(id)))
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
    const order = yield order_model_1.Order.findById(id).populate('cow').populate('buyer');
    return order;
});
exports.orderService = {
    createOrder,
    getOrders,
    getOrder,
};
