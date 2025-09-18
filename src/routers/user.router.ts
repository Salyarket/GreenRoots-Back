import { Router } from "express";
import { checkRoles } from "../middlewares/access-control.middleware.js";
import {
  getAllUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe
} from "../controllers/user.controller.js";

export const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get("/users", checkRoles(["admin"]), getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID (admin only)
 *     tags: [Users]
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
 *         description: Utilisateur trouvé
 *       404:
 *         description: Utilisateur introuvable
 */
router.get("/users/:id", checkRoles(["admin"]), getOneUser);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Créer un nouvel utilisateur (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *               - userTypeId
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [member, admin]
 *               entity_name:
 *                 type: string
 *               userTypeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Requête invalide
 */
router.post("/users", checkRoles(["admin"]), createUser);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Mettre à jour un utilisateur (admin only)
 *     tags: [Users]
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
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [member, admin]
 *               entity_name:
 *                 type: string
 *               userTypeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur introuvable
 */
router.patch("/users/:id", checkRoles(["admin"]), updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur (admin only)
 *     tags: [Users]
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
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur introuvable
 */
router.delete("/users/:id", checkRoles(["admin"]), deleteUser);

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Récupérer son propre profil (member ou admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil de l’utilisateur connecté
 */
router.get("/me", checkRoles(["member", "admin"]), getMe);

/**
 * @swagger
 * /me:
 *   patch:
 *     summary: Mettre à jour son propre profil (member ou admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               entity_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       404:
 *         description: Utilisateur introuvable
 */
router.patch("/me", checkRoles(["member", "admin"]), updateMe);
