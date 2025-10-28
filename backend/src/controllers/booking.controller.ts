import type { Request, Response } from "express";

import { bookingService } from "@services/booking.service";

export const BookingController = {
        async list(req: Request, res: Response) {
                const userId = req.query.userId ? Number(req.query.userId) : undefined;
                const bookings = await bookingService.list(userId);
                res.json({ bookings });
        },
        async create(req: Request, res: Response) {
                const booking = await bookingService.create(req.body);
                res.status(201).json({ booking });
        },
        async get(req: Request, res: Response) {
                const booking = await bookingService.get(Number(req.params.id));
                res.json({ booking });
        },
        async update(req: Request, res: Response) {
                const booking = await bookingService.update(Number(req.params.id), req.body);
                res.json({ booking });
        },
};

export default BookingController;
