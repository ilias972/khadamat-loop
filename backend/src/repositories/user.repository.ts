import type { Prisma } from "@prisma/client";

import prisma from "@utils/prisma";

export const userRepository = {
        createUser: (data: Prisma.UserCreateInput) => prisma.user.create({ data }),
        findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
        findById: (id: number) =>
                prisma.user.findUnique({
                        where: { id },
                        include: { addresses: true },
                }),
        listUsers: () =>
                prisma.user.findMany({
                        include: { addresses: true },
                        orderBy: { createdAt: "desc" },
                }),
        updateUser: (id: number, data: Prisma.UserUpdateInput) =>
                prisma.user.update({ where: { id }, data }),
};

export default userRepository;
