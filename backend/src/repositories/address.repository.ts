import type { Prisma } from "@prisma/client";

import prisma from "@utils/prisma";

export const addressRepository = {
        listByUser: (userId: number) =>
                prisma.address.findMany({
                        where: { userId },
                        orderBy: { createdAt: "desc" },
                }),
        createAddress: (data: Prisma.AddressCreateInput) => prisma.address.create({ data }),
        updateAddress: (id: number, data: Prisma.AddressUpdateInput) =>
                prisma.address.update({ where: { id }, data }),
        deleteAddress: (id: number) => prisma.address.delete({ where: { id } }),
};

export default addressRepository;
