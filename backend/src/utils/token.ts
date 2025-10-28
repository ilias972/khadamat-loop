import jwt from "jsonwebtoken";

import { env } from "@config/env";

export interface JwtPayload {
        userId: number;
        role: string;
}

export const generateAccessToken = (payload: JwtPayload) =>
        jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRATION });

export const generateRefreshToken = (payload: JwtPayload) => {
        if (!env.REFRESH_TOKEN_SECRET) {
                throw new Error("REFRESH_TOKEN_SECRET is not configured");
        }

        return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
                expiresIn: env.REFRESH_TOKEN_EXPIRATION,
        });
};

export const verifyAccessToken = (token: string): JwtPayload => {
        return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
        if (!env.REFRESH_TOKEN_SECRET) {
                throw new Error("REFRESH_TOKEN_SECRET is not configured");
        }

        return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as JwtPayload;
};
