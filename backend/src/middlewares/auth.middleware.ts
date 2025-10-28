import type { NextFunction, Request, Response } from "express";

import { ApiError } from "@middlewares/error.middleware";
import prisma from "@utils/prisma";
import { verifyAccessToken } from "@utils/token";

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw new ApiError(401, "Authentication token is missing");
        }

        const token = authHeader.replace("Bearer ", "");
        const payload = verifyAccessToken(token);

        const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                select: { id: true, role: true, email: true },
        });

        if (!user) {
                throw new ApiError(401, "Invalid authentication token");
        }

        req.user = { id: user.id, role: user.role };
        next();
};
