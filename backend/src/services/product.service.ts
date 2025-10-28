import { z } from "zod";

import { ApiError } from "@middlewares/error.middleware";
import productRepository from "@repositories/product.repository";

export const productSchemas = {
        create: z.object({
                body: z.object({
                        name: z.string().min(1),
                        description: z.string().optional(),
                        price: z.coerce.number().nonnegative(),
                        tags: z.string().optional(),
                }),
        }),
        update: z.object({
                params: z.object({
                        id: z.coerce.number().int().positive(),
                }),
                body: z.object({
                        name: z.string().min(1).optional(),
                        description: z.string().optional(),
                        price: z.coerce.number().nonnegative().optional(),
                        tags: z.string().optional(),
                }),
        }),
};

class ProductService {
        list() {
                return productRepository.listProducts();
        }

        async get(id: number) {
                const product = await productRepository.findById(id);
                if (!product) {
                        throw new ApiError(404, "Product not found");
                }

                return product;
        }

        create(data: { name: string; description?: string; price: number; tags?: string }) {
                return productRepository.createProduct(data);
        }

        async update(id: number, data: { name?: string; description?: string; price?: number; tags?: string }) {
                await this.get(id);
                return productRepository.updateProduct(id, data);
        }

        async remove(id: number) {
                await this.get(id);
                await productRepository.deleteProduct(id);
        }
}

export const productService = new ProductService();

export default productService;
