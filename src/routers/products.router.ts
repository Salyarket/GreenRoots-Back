import { Router } from "express";
import * as productsController from "../controllers/products.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

export const router = Router();

router.get("/products", productsController.getAllProducts);
router.get("/products/:id", productsController.getOneProduct);
router.post("/products", upload.array("images", 3),  productsController.createProduct);
router.patch("/products/:id", upload.any(), productsController.updateProduct);
router.delete("/products/:id",  productsController.deleteProduct);