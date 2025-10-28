import { Router } from "express";

import ProductsController from "@controllers/products.controller";
import { adminMiddleware } from "@middlewares/admin.middleware";
import { authMiddleware } from "@middlewares/auth.middleware";
import { validateRequest } from "@middlewares/validation.middleware";
import { productSchemas } from "@services/product.service";
import asyncHandler from "@utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(ProductsController.list));
router.get("/:id", asyncHandler(ProductsController.get));
router.post(
        "/",
        authMiddleware,
        adminMiddleware,
        validateRequest(productSchemas.create),
        asyncHandler(ProductsController.create),
);
router.put(
        "/:id",
        authMiddleware,
        adminMiddleware,
        validateRequest(productSchemas.update),
        asyncHandler(ProductsController.update),
);
router.delete(
        "/:id",
        authMiddleware,
        adminMiddleware,
        asyncHandler(ProductsController.remove),
);

export default router;
