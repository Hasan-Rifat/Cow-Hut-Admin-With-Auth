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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("./user.model");
const getAllUser = () => {
    const data = user_model_1.User.where({});
    return data;
};
const getSingleUser = (id) => {
    const data = user_model_1.User.findById(id);
    return data;
};
const updateUser = (id, payload) => {
    const data = user_model_1.User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return data;
};
const deleteUser = (id) => {
    const data = user_model_1.User.findByIdAndDelete(id);
    return data;
};
const getMyProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById({
        _id: userId,
    });
    return result;
});
const profileUpdate = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_model_1.User.findById({ _id: userId });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const { name } = payload, userData = __rest(payload, ["name"]);
    const updateUser = Object.assign({}, userData);
    // dynamic update name
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`;
            updateUser[nameKey] = name[key];
        });
    }
    const result = yield user_model_1.User.findByIdAndUpdate({ _id: userId }, updateUser, {
        new: true,
    });
    return result;
});
exports.UserService = {
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser,
    getMyProfile,
    profileUpdate,
};
