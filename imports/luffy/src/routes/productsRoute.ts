import { Router } from "express";
import { createProduct, deleteProduct, getProductById, listProduct, updateProduct } from "../controllers/productController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const productsRoutes:Router = Router();

productsRoutes.post('/create', [authMiddleware,adminMiddleware],createProduct);
productsRoutes.put('/:id', [authMiddleware,adminMiddleware],updateProduct);
productsRoutes.delete('/:id', [authMiddleware,adminMiddleware],deleteProduct);
productsRoutes.get('/lists', [authMiddleware,adminMiddleware],listProduct);
productsRoutes.get('/:id', [authMiddleware,adminMiddleware],getProductById);

export default productsRoutes;