import type { Prisma } from "@prisma/client";

import prisma from "@utils/prisma";

export const paymentRepository = {
        listPayments: () =>
                prisma.payment.findMany({
                        include: {
                                user: true,
                                booking: true,
                        },
                        orderBy: { createdAt: "desc" },
                }),
        createPayment: (data: Prisma.PaymentUncheckedCreateInput) => prisma.payment.create({ data }),
        updatePayment: (id: number, data: Prisma.PaymentUncheckedUpdateInput) =>
                prisma.payment.update({ where: { id }, data }),
};

export default paymentRepository;
