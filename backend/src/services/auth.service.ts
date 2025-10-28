import { z } from "zod";

import { ApiError } from "@middlewares/error.middleware";
import { loggerService } from "@services/logger.service";
import userRepository from "@repositories/user.repository";
import { comparePassword, hashPassword } from "@utils/password";
import { generateAccessToken, generateRefreshToken } from "@utils/token";
import { env } from "@config/env";

export const authSchemas = {
        register: z.object({
                body: z.object({
                        email: z.string().email(),
                        password: z.string().min(8),
                        role: z.string().optional(),
                }),
        }),
        login: z.object({
                body: z.object({
                        email: z.string().email(),
                        password: z.string().min(8),
                }),
        }),
};

class AuthService {
        async register(email: string, password: string, role = "CLIENT") {
                const existing = await userRepository.findByEmail(email);
                if (existing) {
                        throw new ApiError(409, "Email already in use");
                }

                const hashedPassword = await hashPassword(password);

                const user = await userRepository.createUser({
                        email,
                        password: hashedPassword,
                        role,
                });

                loggerService.info(`New user registered: ${email}`);

                const { password: _password, ...safeUser } = user;

                return {
                        user: safeUser,
                        accessToken: generateAccessToken({ userId: user.id, role: user.role }),
                };
        }

        async login(email: string, password: string) {
                const user = await userRepository.findByEmail(email);

                if (!user) {
                        throw new ApiError(401, "Invalid credentials");
                }

                const passwordMatch = await comparePassword(password, user.password);
                if (!passwordMatch) {
                        throw new ApiError(401, "Invalid credentials");
                }

                const accessToken = generateAccessToken({ userId: user.id, role: user.role });
                const refreshToken = env.REFRESH_TOKEN_SECRET
                        ? generateRefreshToken({ userId: user.id, role: user.role })
                        : undefined;
                const { password: _password, ...safeUser } = user;

                return { user: safeUser, accessToken, refreshToken };
        }
}

export const authService = new AuthService();

export default authService;
