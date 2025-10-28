import type { Request, Response } from "express";

import { serviceService } from "@services/service.service";

export const ServicesController = {
        async list(_req: Request, res: Response) {
                const services = await serviceService.list();
                res.json({ services });
        },
        async create(req: Request, res: Response) {
                const service = await serviceService.create(req.body);
                res.status(201).json({ service });
        },
        async get(req: Request, res: Response) {
                const service = await serviceService.get(Number(req.params.id));
                res.json({ service });
        },
        async update(req: Request, res: Response) {
                const service = await serviceService.update(Number(req.params.id), req.body);
                res.json({ service });
        },
        async remove(req: Request, res: Response) {
                await serviceService.remove(Number(req.params.id));
                res.status(204).send();
        },
};

export default ServicesController;
