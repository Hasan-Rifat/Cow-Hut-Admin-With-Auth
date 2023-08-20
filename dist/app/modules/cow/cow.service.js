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
exports.CowService = void 0;
const paginationHelpers_1 = __importDefault(require("../../../helpers/paginationHelpers"));
const cow_constants_1 = require("./cow.constants");
const cow_model_1 = require("./cow.model");
const getAllCows = (paginationOptions, searchFilterFields) => __awaiter(void 0, void 0, void 0, function* () {
    // pagination
    const { page, limit, skip } = (0, paginationHelpers_1.default)(paginationOptions);
    // sort condition
    const sortConditions = {};
    // search condition
    const { searchTerm, minPrice, maxPrice } = searchFilterFields, filtersData = __rest(searchFilterFields, ["searchTerm", "minPrice", "maxPrice"]);
    const andConditions = [];
    // search condition
    if (searchTerm) {
        andConditions.push({
            $or: cow_constants_1.cowSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    // filter condition
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    if (minPrice) {
        andConditions.push({
            price: {
                $gte: minPrice,
            },
        });
    }
    if (maxPrice) {
        andConditions.push({
            price: {
                $lte: maxPrice,
            },
        });
    }
    const whereConditions = andConditions.length ? { $and: andConditions } : {};
    const data = yield cow_model_1.Cow.find(whereConditions)
        .populate('seller')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield cow_model_1.Cow.countDocuments();
    const meta = { page, limit, total };
    return {
        meta,
        data,
    };
});
const createCow = (cow) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.create(cow);
    return result;
});
const singleCow = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.findById(id).populate('seller');
    return result;
});
const updateCow = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
const deleteCow = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.findByIdAndDelete(id);
    return result;
});
exports.CowService = {
    getAllCows,
    createCow,
    singleCow,
    updateCow,
    deleteCow,
};
