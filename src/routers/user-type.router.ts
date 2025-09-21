import { Router } from "express";
import userTypeController from "../controllers/user-type.controllers.js";
import { checkRoles } from "../middlewares/access-control.middleware.js";

const router = Router();

/**
 * @swagger
 * /user-types:
 *  get:
 *    summary: Lister tous les types d'utilisateurs
 *    description: Retourne la liste complète des types d'utilisateurs
 *    tags: [User-types]
 *    responses:
 *      200:
 *        description: Liste des types d'utilisateurs récupérée avec succès
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/UserType'
 *      400:
 *        description: Paramètres de requête invalides
 */
router.get("/", userTypeController.getAll);

/**
 * @swagger
 * /user-types/{id}:
 *  get:
 *    summary: Lister un terrain
 *    description: Retourne les informations d'un type d'utilisateurs
 *    tags: [User-types]
 *    parameters:
 *      - in : path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1
 *        description: ID du type d'utilisateurs à récupérer
 *    responses:
 *      200:
 *        description: Informations d'un type d'utilisateurs récupérées avec succès
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserType'
 *      404:
 *        description: Type non trouvé
 *      400:
 *        description: Paramètres de requête invalides
 */
router.get("/:id", checkRoles(["admin"]), userTypeController.getById);

/**
 * @swagger
 * /user-types:
 *   post:
 *     summary: Créer un type d'utilisateurs
 *     description: Ajoute un nouveau type d'utilisateurs dans la base de données
 *     tags: [User-types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserType'
 *     responses:
 *       201:
 *         description: Type d'utilisateurs créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserType'
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post("/", userTypeController.create);

/**
 * @swagger
 * /user-types/{id}:
 *   patch:
 *     summary: Mettre à jour un type d'utilisateurs
 *     description: Met à jour les informations d'un type d'utilisateurs existant
 *     tags: [User-types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID du type d'utilisateurs à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserType'
 *     responses:
 *       200:
 *         description: Type d'utilisateurs mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserType'
 *       404:
 *         description: Type d'utilisateurs non trouvé
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.patch("/:id", userTypeController.update);

/**
 * @swagger
 * /user-types/{id}:
 *   delete:
 *     summary: Supprimer un type d'utilisateurs
 *     description: Supprime un type d'utilisateurs existant
 *     tags: [User-types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID du type d'utilisateurs à supprimer
 *     responses:
 *       200:
 *         description: Type d'utilisateurs supprimé avec succès
 *       404:
 *         description: Type d'utilisateurs non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", checkRoles(["admin"]), userTypeController.deleteById);

export default router;
