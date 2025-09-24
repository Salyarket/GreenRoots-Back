import { Router } from "express";
import  productController from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

export const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Récupérer toutes les produits (back-office)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Liste des produits
 */
// Récup toutes les produits 
router.get("/", productController.getAll);
router.get("/pagination", productController.getProductsWithPagination);
router.get("/with_location/:id", productController.getOneProductWithLocations);
router.get("/:id", productController.getById);
router.post("/", upload.array("images", 3), productController.createProduct);
router.patch("/:id", upload.any(), productController.updateProduct);
router.delete("/:id",  productController.deleteProduct);

export default router;