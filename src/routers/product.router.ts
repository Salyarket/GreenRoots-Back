import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { checkRoles } from "../middlewares/access-control.middleware.js";

export const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Récupérer tous les produits (back-office)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Liste des produits
 */
// Récup toutes les produits
router.get("/", productController.getAll);

/**
 * @swagger
 * /products/pagination:
 *   get:
 *     summary: Récupérer tous les produits avec pagination et trie ASC et DESC sur les champs de l'entité product (back-office)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Liste des produits
 */
// récup tous les produits dispo à la vente (available = true)
router.get(
  "/pagination/available",
  productController.getAllAvailableWithPagination
);

// admin récup tous les produits meme non dispo à la vente pour crud
router.get(
  "/pagination/all",
  checkRoles(["admin"]),
  productController.getAllWithPagination
);

/**
 * @swagger
 * /products/with_location/{id}:
 *   get:
 *     summary: Récupérer un produit par ID et ses localisations
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

/**
 * @swagger
 * /products/{id}:
 *   post:
 *     summary: Créer un produit (admin only)
 *     tags: [Products]
 */
router.post(
  "/",
  checkRoles(["admin"]),
  upload.array("images", 3),
  productController.createProduct
);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Mettre à jour un produit par son ID (admin only)
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
// patch pour modifier un produit
router.patch(
  "/:id",
  checkRoles(["admin"]),
  upload.any(),
  productController.updateProduct
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: supprimer un produit par son ID (admin only)
 *     tags: [Products]
 */
router.delete("/:id", checkRoles(["admin"]), productController.deleteProduct);

// soft delete : suppression douce = on archive le produit avec available false pour le sortir du catalogue mais on garde la trace
// PATCH /products/:id/archive
router.patch(
  "/:id/archive",
  checkRoles(["admin"]),
  productController.archiveProduct
);

export default router;
