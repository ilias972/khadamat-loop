import type { Prisma } from "@prisma/client";

import prisma from "@utils/prisma";

export const bookingRepository = {
        listBookings: (userId?: number) =>
                prisma.booking.findMany({
                        where: userId
                                ? {
                                          OR: [
                                                  { clientId: userId },
                                                  { providerId: userId },
                                          ],
                                  }
                                : undefined,
                        include: {
                                client: true,
                                provider: true,
                                service: true,
                                payment: true,
                        },
                        orderBy: { createdAt: "desc" },
                }),
        findById: (id: number) =>
                prisma.booking.findUnique({
                        where: { id },
                        include: {
                                client: true,
                                provider: true,
                                service: true,
                                payment: true,
                        },
                }),
        createBooking: (data: Prisma.BookingUncheckedCreateInput) => prisma.booking.create({ data }),
        updateBooking: (id: number, data: Prisma.BookingUncheckedUpdateInput) =>
                prisma.booking.update({ where: { id }, data }),
};

export default bookingRepository;
