import { z } from "zod";

export const signUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
});

export const AddressSchema = z.object({
    lineOne: z.string(),
    lineTwo: z.string().nullable(),
    pincode: z.number().min(6),
    country: z.string(),
    city: z.string(),
    userId: z.number()
});

export const updateUserSchema = z.object({
    name: z.string().nullable(),
    defaultShippingAddress: z.string().nullable(),   
    defaultBillingAddress: z.string().nullable(),
});