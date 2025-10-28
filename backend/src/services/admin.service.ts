import { z } from "zod";

import { ApiError } from "@middlewares/error.middleware";
import bookingRepository from "@repositories/booking.repository";
import paymentRepository from "@repositories/payment.repository";
import userRepository from "@repositories/user.repository";

export const adminSchemas = {
        updateUserRole: z.object({
                params: z.object({
                        id: z.coerce.number().int().positive(),
                }),
                body: z.object({
                        role: z.enum(["ADMIN", "PROVIDER", "CLIENT"]),
                }),
        }),
};

class AdminService {
        dashboard() {
                return Promise.all([
                        userRepository.listUsers(),
                        bookingRepository.listBookings(),
                        paymentRepository.listPayments(),
                ]).then(([users, bookings, payments]) => ({
                        users: users.length,
                        bookings: bookings.length,
                        payments: payments.length,
                }));
        }

        async updateUserRole(id: number, role: string) {
                const user = await userRepository.findById(id);
                if (!user) {
                        throw new ApiError(404, "User not found");
                }

                return userRepository.updateUser(id, { role });
        }
}

export const adminService = new AdminService();

export default adminService;
