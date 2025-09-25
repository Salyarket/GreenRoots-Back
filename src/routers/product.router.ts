import { Router } from "express";
import  productController from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { checkRoles } from "../middlewares/access-control.middleware.js";

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
router.get("/pagination", productController.getAllWithPagination);
router.get("/with_location/:id", productController.getOneProductWithLocations);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Récupérer un produit par ID 
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produit trouvé
 *       404:
 *         description: Produit introuvable
 */
router.get("/:id", productController.getById);
<<<<<<< HEAD


router.post("/", upload.array("images", 3), productController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Mettre à jour un produit (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *          multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Product_patch'
 *     responses:
 *       200:
 *         description: Produit mis à jour
 *       404:
 *         description: Produit introuvable
 */
router.patch("/:id", upload.any(), productController.updateProduct);
router.delete("/:id",  productController.deleteProduct);
=======
router.post("/", checkRoles(["admin"]), upload.array("images", 3), productController.createProduct);
router.patch("/:id", checkRoles(["admin"]), upload.any(), productController.updateProduct);
router.delete("/:id", checkRoles(["admin"]),  productController.deleteProduct);
>>>>>>> dev

export default router;