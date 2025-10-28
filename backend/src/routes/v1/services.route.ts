import { Router } from "express";

import ServicesController from "@controllers/services.controller";
import { adminMiddleware } from "@middlewares/admin.middleware";
import { authMiddleware } from "@middlewares/auth.middleware";
import { validateRequest } from "@middlewares/validation.middleware";
import { serviceSchemas } from "@services/service.service";
import asyncHandler from "@utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(ServicesController.list));
router.get("/:id", asyncHandler(ServicesController.get));
router.post(
        "/",
        authMiddleware,
        adminMiddleware,
        validateRequest(serviceSchemas.create),
        asyncHandler(ServicesController.create),
);
router.put(
        "/:id",
        authMiddleware,
        adminMiddleware,
        validateRequest(serviceSchemas.update),
        asyncHandler(ServicesController.update),
);
router.delete(
        "/:id",
        authMiddleware,
        adminMiddleware,
        asyncHandler(ServicesController.remove),
);

export default router;
