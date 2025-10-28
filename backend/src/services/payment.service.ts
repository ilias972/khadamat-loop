import Stripe from "stripe";
import { z } from "zod";

import { env } from "@config/env";
import paymentRepository from "@repositories/payment.repository";

const stripeClient = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : undefined;

export const paymentSchemas = {
        create: z.object({
                body: z.object({
                        userId: z.coerce.number().int().positive(),
                        bookingId: z.coerce.number().int().positive().optional(),
                        amount: z.coerce.number().nonnegative(),
                        provider: z.string().optional(),
                }),
        }),
};

class PaymentService {
        list() {
                return paymentRepository.listPayments();
        }

        async create(data: { userId: number; bookingId?: number; amount: number; provider?: string }) {
                if (stripeClient && data.provider === "stripe") {
                        await stripeClient.paymentIntents.create({
                                amount: data.amount,
                                currency: "usd",
                                metadata: { userId: data.userId.toString() },
                        });
                }

                return paymentRepository.createPayment({
                        userId: data.userId,
                        bookingId: data.bookingId,
                        amount: data.amount,
                        provider: data.provider,
                        status: "SUCCESS",
                });
        }
}

export const paymentService = new PaymentService();

export default paymentService;
