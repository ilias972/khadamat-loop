import type { Request, Response } from "express";

import { authService } from "@services/auth.service";

export const AuthController = {
        async register(req: Request, res: Response) {
                const { email, password, role } = req.body;
                const result = await authService.register(email, password, role);
                res.status(201).json(result);
        },
        async login(req: Request, res: Response) {
                const { email, password } = req.body;
                const result = await authService.login(email, password);
                res.json(result);
        },
};

export default AuthController;
