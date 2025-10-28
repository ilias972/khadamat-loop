import { z } from "zod";

import addressRepository from "@repositories/address.repository";
import userRepository from "@repositories/user.repository";
import { ApiError } from "@middlewares/error.middleware";

export const userSchemas = {
        updateProfile: z.object({
                body: z.object({
                        preferredLang: z.string().optional(),
                        phone: z.string().optional(),
                }),
                params: z.object({
                        id: z.coerce.number().int().positive(),
                }),
        }),
        upsertAddress: z.object({
                body: z.object({
                        line1: z.string().min(1),
                        line2: z.string().optional(),
                        city: z.string().min(1),
                        country: z.string().min(1),
                        postalCode: z.string().min(3),
                        isDefault: z.boolean().optional(),
                }),
                params: z.object({
                        id: z.coerce.number().int().positive(),
                        addressId: z.coerce.number().int().positive().optional(),
                }),
        }),
};

class UserService {
        getProfile(id: number) {
                return userRepository.findById(id);
        }

        async updateProfile(id: number, data: { preferredLang?: string; phone?: string }) {
                const user = await userRepository.findById(id);
                if (!user) {
                        throw new ApiError(404, "User not found");
                }

                return userRepository.updateUser(id, data);
        }

        async listUsers() {
                return userRepository.listUsers();
        }

        async upsertAddress(
                userId: number,
                addressId: number | undefined,
                data: {
                        line1: string;
                        line2?: string;
                        city: string;
                        country: string;
                        postalCode: string;
                        isDefault?: boolean;
                },
        ) {
                const user = await userRepository.findById(userId);
                if (!user) {
                        throw new ApiError(404, "User not found");
                }

                if (addressId) {
                        return addressRepository.updateAddress(addressId, {
                                line1: data.line1,
                                line2: data.line2,
                                city: data.city,
                                country: data.country,
                                postalCode: data.postalCode,
                                isDefault: data.isDefault,
                        });
                }

                return addressRepository.createAddress({
                        line1: data.line1,
                        line2: data.line2,
                        city: data.city,
                        country: data.country,
                        postalCode: data.postalCode,
                        isDefault: data.isDefault ?? false,
                        user: { connect: { id: userId } },
                });
        }
}

export const userService = new UserService();

export default userService;
