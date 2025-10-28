import type { Prisma } from "@prisma/client";

import prisma from "@utils/prisma";

export const serviceRepository = {
        listServices: () =>
                prisma.service.findMany({
                        include: { provider: { include: { user: true } } },
                        orderBy: { createdAt: "desc" },
                }),
        findById: (id: number) =>
                prisma.service.findUnique({
                        where: { id },
                        include: { provider: { include: { user: true } } },
                }),
        createService: (data: Prisma.ServiceUncheckedCreateInput) => prisma.service.create({ data }),
        updateService: (id: number, data: Prisma.ServiceUncheckedUpdateInput) =>
                prisma.service.update({ where: { id }, data }),
        deleteService: (id: number) => prisma.service.delete({ where: { id } }),
};

export default serviceRepository;
