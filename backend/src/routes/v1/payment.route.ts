import { Router } from "express";

import PaymentController from "@controllers/payment.controller";
import { adminMiddleware } from "@middlewares/admin.middleware";
import { authMiddleware } from "@middlewares/auth.middleware";
import { validateRequest } from "@middlewares/validation.middleware";
import { paymentSchemas } from "@services/payment.service";
import asyncHandler from "@utils/asyncHandler";

const router = Router();

router.get("/", authMiddleware, adminMiddleware, asyncHandler(PaymentController.list));
router.post(
        "/",
        authMiddleware,
        validateRequest(paymentSchemas.create),
        asyncHandler(PaymentController.create),
);

export default router;
