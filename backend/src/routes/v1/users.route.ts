import { Router } from "express";

import UsersController from "@controllers/users.controller";
import { adminMiddleware } from "@middlewares/admin.middleware";
import { authMiddleware } from "@middlewares/auth.middleware";
import { validateRequest } from "@middlewares/validation.middleware";
import { userSchemas } from "@services/user.service";
import asyncHandler from "@utils/asyncHandler";

const router = Router();

router.get("/me", authMiddleware, asyncHandler(UsersController.me));
router.get("/", authMiddleware, adminMiddleware, asyncHandler(UsersController.list));
router.put(
        "/:id",
        authMiddleware,
        validateRequest(userSchemas.updateProfile),
        asyncHandler(UsersController.update),
);
router.put(
        "/:id/addresses/:addressId?",
        authMiddleware,
        validateRequest(userSchemas.upsertAddress),
        asyncHandler(UsersController.upsertAddress),
);

export default router;
