import { z } from "zod";

import { ApiError } from "@middlewares/error.middleware";
import serviceRepository from "@repositories/service.repository";

export const serviceSchemas = {
        create: z.object({
                body: z.object({
                        providerId: z.coerce.number().int().positive(),
                        name: z.string().min(1),
                        description: z.string().optional(),
                        category: z.string().min(1),
                        basePrice: z.coerce.number().nonnegative(),
                }),
        }),
        update: z.object({
                params: z.object({
                        id: z.coerce.number().int().positive(),
                }),
                body: z.object({
                        name: z.string().min(1).optional(),
                        description: z.string().optional(),
                        category: z.string().optional(),
                        basePrice: z.coerce.number().nonnegative().optional(),
                }),
        }),
};

class ServiceService {
        list() {
                return serviceRepository.listServices();
        }

        async get(id: number) {
                const service = await serviceRepository.findById(id);
                if (!service) {
                        throw new ApiError(404, "Service not found");
                }

                return service;
        }

        create(data: { providerId: number; name: string; description?: string; category: string; basePrice: number }) {
                return serviceRepository.createService({
                        providerId: data.providerId,
                        name: data.name,
                        description: data.description,
                        category: data.category,
                        basePrice: data.basePrice,
                });
        }

        async update(id: number, data: { name?: string; description?: string; category?: string; basePrice?: number }) {
                await this.get(id);
                return serviceRepository.updateService(id, data);
        }

        async remove(id: number) {
                await this.get(id);
                await serviceRepository.deleteService(id);
        }
}

export const serviceService = new ServiceService();

export default serviceService;
