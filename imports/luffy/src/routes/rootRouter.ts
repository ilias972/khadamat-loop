
import { Router } from "express";
import authRoutes from "./authRoutes";
import productsRoutes from "./productsRoute";
import addressRoute  from "./addressRoutes";

const rootRouter: Router =Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productsRoutes);
rootRouter.use('/addresses', addressRoute);

export default rootRouter;