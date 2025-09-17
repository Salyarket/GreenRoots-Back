import { Router } from "express";
import locationController from "../controllers/location_controller.js";

const router = Router();

/**
 * @swagger
 * /location:
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
router.get("/", locationController.getAll);

/**
 * @swagger
 * /location/{id}:
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
router.get("/:id", locationController.getById);

/**
 * @swagger
 * /location:
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
router.post("/", locationController.create);

/**
 * @swagger
 * /location/{id}:
 *   put:
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
router.put("/:id", locationController.update);

/**
 * @swagger
 * /location/{id}:
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
router.delete("/:id", locationController.deleteById);

export default router;
