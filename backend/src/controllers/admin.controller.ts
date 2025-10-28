import type { Request, Response } from "express";

import { adminService } from "@services/admin.service";

export const AdminController = {
        async dashboard(_req: Request, res: Response) {
                const data = await adminService.dashboard();
                res.json(data);
        },
        async updateRole(req: Request, res: Response) {
                const updated = await adminService.updateUserRole(Number(req.params.id), req.body.role);
                res.json({ user: updated });
        },
};

export default AdminController;
