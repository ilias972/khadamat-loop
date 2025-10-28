import type { Prisma } from "@prisma/client";

import prisma from "@utils/prisma";

export const productRepository = {
        listProducts: () => prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
        findById: (id: number) => prisma.product.findUnique({ where: { id } }),
        createProduct: (data: Prisma.ProductCreateInput) => prisma.product.create({ data }),
        updateProduct: (id: number, data: Prisma.ProductUpdateInput) =>
                prisma.product.update({ where: { id }, data }),
        deleteProduct: (id: number) => prisma.product.delete({ where: { id } }),
};

export default productRepository;
