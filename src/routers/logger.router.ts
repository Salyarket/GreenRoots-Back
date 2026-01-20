import { Router } from "express";
import loggerController from "../controllers/logger.controller.js";
import { checkRoles } from "../middlewares/access-control.middleware.js";

const router = Router();

// Voir les logs (admin only)
router.get("/", checkRoles(["admin"]), loggerController.getLogs);

// Supprimer les logs (admin only)
router.delete("/", checkRoles(["admin"]), loggerController.clearLogs);

export default router;