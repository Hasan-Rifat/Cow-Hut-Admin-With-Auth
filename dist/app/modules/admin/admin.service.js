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
exports.AdminService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const admin_model_1 = require("./admin.model");
const createAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield admin_model_1.Admin.create(payload));
    return {
        _id: result._id,
        phoneNumber: result.phoneNumber,
        role: result.role,
        name: result.name,
        address: result.address,
    };
});
const loginAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber: payloadNumber, password } = payload;
    const isUserExist = yield admin_model_1.Admin.isAdminExist(payloadNumber);
    // check if user exist
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // check if password match
    if (isUserExist.password &&
        !(yield (admin_model_1.Admin === null || admin_model_1.Admin === void 0 ? void 0 : admin_model_1.Admin.isPasswordMatched(password, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.password)))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect password');
    }
    const { _id, role, phoneNumber } = isUserExist;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ _id, role, phoneNumber }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ _id, role, phoneNumber }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return { accessToken, refreshToken };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh token');
    }
    const { phoneNumber } = verifiedToken;
    const isAdminExist = yield admin_model_1.Admin.isAdminExist(phoneNumber);
    // check if user exist
    if (!isAdminExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // generate new access token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({
        userId: isAdminExist._id,
        role: isAdminExist.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
exports.AdminService = {
    createAdmin,
    loginAdmin,
    refreshToken,
};
