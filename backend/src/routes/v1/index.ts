import { Router } from "express";

import adminRouter from "@routes/v1/admin.route";
import authRouter from "@routes/v1/auth.route";
import bookingRouter from "@routes/v1/booking.route";
import paymentRouter from "@routes/v1/payment.route";
import productsRouter from "@routes/v1/products.route";
import servicesRouter from "@routes/v1/services.route";
import usersRouter from "@routes/v1/users.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/services", servicesRouter);
router.use("/products", productsRouter);
router.use("/bookings", bookingRouter);
router.use("/payments", paymentRouter);
router.use("/admin", adminRouter);

export default router;
