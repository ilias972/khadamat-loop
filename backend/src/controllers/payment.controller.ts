import type { Request, Response } from "express";

import { paymentService } from "@services/payment.service";

export const PaymentController = {
        async list(_req: Request, res: Response) {
                const payments = await paymentService.list();
                res.json({ payments });
        },
        async create(req: Request, res: Response) {
                const payment = await paymentService.create(req.body);
                res.status(201).json({ payment });
        },
};

export default PaymentController;
