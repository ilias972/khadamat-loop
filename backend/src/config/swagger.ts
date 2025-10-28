import swaggerJsdoc from "swagger-jsdoc";

import { env } from "@config/env";

export const swaggerDefinition: swaggerJsdoc.Options["definition"] = {
        openapi: "3.1.0",
        info: {
                title: "Khadamat API",
                version: "1.0.0",
                description: "Unified backend API documentation for Khadamat",
        },
        servers: [
                {
                        url: `http${env.ENABLE_HTTPS ? "s" : ""}://${env.HOST}:${env.PORT}/api`,
                        description: `${env.NODE_ENV} server`,
                },
        ],
        components: {
                securitySchemes: {
                        bearerAuth: {
                                type: "http",
                                scheme: "bearer",
                                bearerFormat: "JWT",
                        },
                },
        },
        security: [{ bearerAuth: [] }],
};

export const swaggerSpec = swaggerJsdoc({
        definition: swaggerDefinition,
        apis: ["src/routes/v1/*.ts", "src/controllers/*.ts"],
});
