import type { Request, Response } from "express";

import { productService } from "@services/product.service";

export const ProductsController = {
        async list(_req: Request, res: Response) {
                const products = await productService.list();
                res.json({ products });
        },
        async create(req: Request, res: Response) {
                const product = await productService.create(req.body);
                res.status(201).json({ product });
        },
        async get(req: Request, res: Response) {
                const product = await productService.get(Number(req.params.id));
                res.json({ product });
        },
        async update(req: Request, res: Response) {
                const product = await productService.update(Number(req.params.id), req.body);
                res.json({ product });
        },
        async remove(req: Request, res: Response) {
                await productService.remove(Number(req.params.id));
                res.status(204).send();
        },
};

export default ProductsController;
