"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowValidationSchema = void 0;
const zod_1 = require("zod");
const cow_constants_1 = require("./cow.constants");
const createCowZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: 'Name is required',
        }),
        age: zod_1.z.number({
            required_error: 'Age is required',
        }),
        price: zod_1.z.number({
            required_error: 'Price is required',
        }),
        location: zod_1.z.enum([...cow_constants_1.location], {
            required_error: 'Location is required',
        }),
        breed: zod_1.z.enum([...cow_constants_1.breed], {
            required_error: 'Breed is required',
        }),
        weight: zod_1.z.number({
            required_error: 'Weight is required',
        }),
        label: zod_1.z.enum([...cow_constants_1.label], {
            required_error: 'Label is required',
        }),
        category: zod_1.z.enum([...cow_constants_1.category], {
            required_error: 'Category is required',
        }),
        seller: zod_1.z.string({
            required_error: 'Seller is required',
        }),
    }),
});
const updateCowZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({
            required_error: 'Name is required',
        })
            .optional(),
        age: zod_1.z
            .number({
            required_error: 'Age is required',
        })
            .optional(),
        price: zod_1.z
            .number({
            required_error: 'Price is required',
        })
            .optional(),
        location: zod_1.z
            .enum([...cow_constants_1.location], {
            required_error: 'Location is required',
        })
            .optional(),
        breed: zod_1.z
            .enum([...cow_constants_1.breed], {
            required_error: 'Breed is required',
        })
            .optional(),
        weight: zod_1.z
            .number({
            required_error: 'Weight is required',
        })
            .optional(),
        label: zod_1.z
            .enum([...cow_constants_1.label], {
            required_error: 'Label is required',
        })
            .optional(),
        category: zod_1.z
            .enum([...cow_constants_1.category], {
            required_error: 'Category is required',
        })
            .optional(),
        seller: zod_1.z
            .string({
            required_error: 'Seller is required',
        })
            .optional(),
    }),
});
exports.CowValidationSchema = {
    createCowZodSchema,
    updateCowZodSchema,
};
