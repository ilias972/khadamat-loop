import "express-serve-static-core";

declare global {
        namespace Express {
                interface UserPayload {
                        id: number;
                        role: string;
                }

                interface Request {
                        user?: UserPayload;
                }
        }
}

export {};
