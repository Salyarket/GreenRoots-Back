import { Router } from "express";
import * as productsController from "../controllers/products.controller.js";

export const router = Router();

console.log("est-ce que je passe par le router");

router.get("/products", productsController.getAllProducts);
router.get("/products/:id", productsController.getOneProduct);
// router.post("/products",  productsController.createProduct);
// router.patch("/products/:id",  productsController.updateProduct);
// router.delete("/products/:id",  productsController.deleteProduct);