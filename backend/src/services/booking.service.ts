import { z } from "zod";

import bookingRepository from "@repositories/booking.repository";
import { ApiError } from "@middlewares/error.middleware";

export const bookingSchemas = {
        create: z.object({
                body: z.object({
                        clientId: z.coerce.number().int().positive(),
                        providerId: z.coerce.number().int().positive(),
                        serviceId: z.coerce.number().int().positive(),
                        title: z.string().min(1),
                        description: z.string().optional(),
                        scheduledDay: z.string().min(1),
                        price: z.coerce.number().nonnegative().default(0),
                }),
        }),
        update: z.object({
                params: z.object({
                        id: z.coerce.number().int().positive(),
                }),
                body: z.object({
                        status: z.string().optional(),
                        scheduledDay: z.string().optional(),
                        agreedStartTime: z.string().optional(),
                        price: z.coerce.number().nonnegative().optional(),
                }),
        }),
};

class BookingService {
        list(userId?: number) {
                return bookingRepository.listBookings(userId);
        }

        async get(id: number) {
                const booking = await bookingRepository.findById(id);
                if (!booking) {
                        throw new ApiError(404, "Booking not found");
                }

                return booking;
        }

        create(data: {
                clientId: number;
                providerId: number;
                serviceId: number;
                title: string;
                description?: string;
                scheduledDay: string;
                price: number;
        }) {
                return bookingRepository.createBooking({
                        clientId: data.clientId,
                        providerId: data.providerId,
                        serviceId: data.serviceId,
                        title: data.title,
                        description: data.description ?? "",
                        scheduledDay: data.scheduledDay,
                        price: data.price,
                        status: "PENDING",
                });
        }

        async update(
                id: number,
                data: { status?: string; scheduledDay?: string; agreedStartTime?: string; price?: number },
        ) {
                await this.get(id);
                return bookingRepository.updateBooking(id, data);
        }
}

export const bookingService = new BookingService();

export default bookingService;
