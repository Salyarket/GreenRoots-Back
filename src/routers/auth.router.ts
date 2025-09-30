import { Router } from "express";
import userController from "../controllers/user-auth.controller.js";

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Enregistrer un nouvel utilisateur
 *     tags: [Authentification]
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
 *               - user_type_id
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: "Marie"
 *               lastname:
 *                 type: string
 *                 example: "Dupont"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *               user_type_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Inscription réussie
 *       400:
 *         description: Requête invalide (paramètres manquants ou invalides)
 */

router.post("/register", userController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Se connecter à un compte utilisateur existant
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       400:
 *         description: Requête invalide (paramètres manquants ou invalides)
 *       401:
 *         description: Identifiants incorrects
 */

router.post("/login", userController.login);

router.post("/logout", userController.logoutUser);

export default router;
