import { Router } from "express";

import BookingController from "@controllers/booking.controller";
import { authMiddleware } from "@middlewares/auth.middleware";
import { validateRequest } from "@middlewares/validation.middleware";
import { bookingSchemas } from "@services/booking.service";
import asyncHandler from "@utils/asyncHandler";

const router = Router();

router.get("/", authMiddleware, asyncHandler(BookingController.list));
router.post(
        "/",
        authMiddleware,
        validateRequest(bookingSchemas.create),
        asyncHandler(BookingController.create),
);
router.get("/:id", authMiddleware, asyncHandler(BookingController.get));
router.put(
        "/:id",
        authMiddleware,
        validateRequest(bookingSchemas.update),
        asyncHandler(BookingController.update),
);

export default router;
