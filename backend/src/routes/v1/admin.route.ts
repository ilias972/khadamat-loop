import { Router } from "express";

import AdminController from "@controllers/admin.controller";
import { adminMiddleware } from "@middlewares/admin.middleware";
import { authMiddleware } from "@middlewares/auth.middleware";
import { validateRequest } from "@middlewares/validation.middleware";
import { adminSchemas } from "@services/admin.service";
import asyncHandler from "@utils/asyncHandler";

const router = Router();

router.get("/dashboard", authMiddleware, adminMiddleware, asyncHandler(AdminController.dashboard));
router.patch(
        "/users/:id/role",
        authMiddleware,
        adminMiddleware,
        validateRequest(adminSchemas.updateUserRole),
        asyncHandler(AdminController.updateRole),
);

export default router;
