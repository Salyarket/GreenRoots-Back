import { Router } from "express";
import { checkRoles } from "../middlewares/access-control.middleware.js";
import orderController from "../controllers/order.controller.js";

const router = Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Récupérer toutes les commandes (back-office)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes
 */
// Récup toutes les commandes (admin only, back-office)
router.get("/", checkRoles(["admin"]), orderController.getAll);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Récupérer une commande par ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Commande trouvée
 *       404:
 *         description: Commande introuvable
 */
// voir commande complète avec user + type + items
router.get("/:id", checkRoles(["admin"]), orderController.getById);

/**
 * @swagger
 * /users/{id}/orders:
 *   get:
 *     summary: Récupérer les commandes d’un utilisateur (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des commandes de l’utilisateur
 */
// voir commandes d’un utilisateur précis (admin only)
router.get(
  "/users/:id/orders",
  checkRoles(["admin"]),
  orderController.getOrdersByUserId,
  (req, res) => {
    const userId = req.params.id;
    res.json({ message: `Commandes de l’utilisateur ${userId}` });
  }
);

/**
 * @swagger
 * /me/orders:
 *   get:
 *     summary: Récupérer les commandes de l’utilisateur connecté (member only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes personnelles
 */
// voir commandes type historique personnel (member only)
router.get(
  "/me/orders",
  checkRoles(["member"]),
  orderController.getMyOrders,
  (req, res) => {
    res.json({
      message: `Commandes de l’utilisateur connecté ${(req as any).userId}`,
    });
  }
);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Créer une commande depuis le panier
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - total
 *               - userId
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, cancelled]
 *               total:
 *                 type: number
 *               userId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Commande créée
 *       400:
 *         description: Requête invalide
 */
// créer une commande depuis le panier (member only)
router.post("/", checkRoles(["member"]), orderController.createOrder);

/**
 * @swagger
 * /orders/{id}:
 *   patch:
 *     summary: Modifier une commande (changer statut ou total)
 *     tags: [Orders]
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, cancelled]
 *               total:
 *                 type: number
 *     responses:
 *       200:
 *         description: Commande mise à jour
 *       404:
 *         description: Commande introuvable
 */
// modifier le statut (admin only : pending > paid/cancelled)
router.patch("/:id", checkRoles(["admin"]), orderController.updateOrder);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Supprimer une commande (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Commande supprimée
 *       404:
 *         description: Commande introuvable
 */
// Supprimer une commande (admin only)
router.delete("/:id", checkRoles(["admin"]), orderController.deleteById);

export default router;
