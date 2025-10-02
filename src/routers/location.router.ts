import { Router } from "express";
import locationController from "../controllers/location.controller.js";
import { checkRoles } from "../middlewares/access-control.middleware.js";

const router = Router();

/**
 * @swagger
 * /locations:
 *  get:
 *    summary: Lister tous les terrains
 *    description: Retourne la liste complète des terrains disponibles
 *    tags: [Locations]
 *    responses:
 *      200:
 *        description: Liste des terrains récupérée avec succès
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Location'
 *      400:
 *        description: Paramètres de requête invalides
 */
router.get("/", checkRoles(["admin"]), locationController.getAll);

/**
 * @swagger
 * /locations/{id}:
 *  get:
 *    summary: Lister un terrain
 *    description: Retourne les informations d'un terrain
 *    tags: [Locations]
 *    parameters:
 *      - in : path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1
 *        description: ID du terrain à récupérer
 *    responses:
 *      200:
 *        description: Informations d'un terrain récupérées avec succès
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Location'
 *      404:
 *        description: Terrain non trouvé
 *      400:
 *        description: Paramètres de requête invalides
 */
router.get("/:id", checkRoles(["admin"]), locationController.getById);

/**
 * @swagger
 * /locations/pagination:
 *   get:
 *     summary: Récupérer tous les locations avec pagination et trie ASC et DESC sur les champs de l'entité user (back-office)
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: Liste des localisations
 */
router.get("/pagination",checkRoles(["admin"]), locationController.getAllWithPagination);

/**
 * @swagger
 * /locations:
 *   post:
 *     summary: Créer un terrain
 *     description: Ajoute un nouveau terrain dans la base de données
 *     tags: [Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       201:
 *         description: Terrain créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post("/", checkRoles(["admin"]), locationController.create);

/**
 * @swagger
 * /locations/{id}:
 *   patch:
 *     summary: Mettre à jour un terrain
 *     description: Met à jour les informations d'un terrain existant
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID du terrain à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       200:
 *         description: Terrain mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       404:
 *         description: Terrain non trouvé
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.patch("/:id", checkRoles(["admin"]), locationController.update);

/**
 * @swagger
 * /locations/{id}:
 *   delete:
 *     summary: Supprimer un terrain
 *     description: Supprime un terrain existant
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID du terrain à supprimer
 *     responses:
 *       200:
 *         description: Terrain supprimé avec succès
 *       404:
 *         description: Terrain non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", checkRoles(["admin"]), locationController.deleteById);

export default router;
