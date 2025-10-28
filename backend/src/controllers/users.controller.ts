import type { Request, Response } from "express";

import { userService } from "@services/user.service";

export const UsersController = {
        async me(req: Request, res: Response) {
                const userId = req.user?.id;
                const user = userId ? await userService.getProfile(userId) : null;
                if (!user) {
                        return res.json({ user: null });
                }
                const { password: _password, ...safeUser } = user;
                res.json({ user: safeUser });
        },
        async list(_req: Request, res: Response) {
                const users = await userService.listUsers();
                const safeUsers = users.map(({ password: _password, ...rest }) => rest);
                res.json({ users: safeUsers });
        },
        async update(req: Request, res: Response) {
                const { id } = req.params;
                const updated = await userService.updateProfile(Number(id), req.body);
                const { password: _password, ...safeUser } = updated;
                res.json({ user: safeUser });
        },
        async upsertAddress(req: Request, res: Response) {
                const { id, addressId } = req.params;
                const address = await userService.upsertAddress(Number(id), addressId ? Number(addressId) : undefined, req.body);
                res.status(addressId ? 200 : 201).json({ address });
        },
};

export default UsersController;
