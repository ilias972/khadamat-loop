import { Router } from "express";

import AuthController from "@controllers/auth.controller";
import { validateRequest } from "@middlewares/validation.middleware";
import { authSchemas } from "@services/auth.service";
import asyncHandler from "@utils/asyncHandler";

const router = Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserInput'
 *     responses:
 *       201:
 *         description: User registered
 */
router.post(
        "/register",
        validateRequest(authSchemas.register),
        asyncHandler(AuthController.register),
);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Authenticate a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserInput'
 *     responses:
 *       200:
 *         description: Authentication successful
 */
router.post("/login", validateRequest(authSchemas.login), asyncHandler(AuthController.login));

/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterUserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 8
 *         role:
 *           type: string
 *     LoginUserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 */

export default router;
