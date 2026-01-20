import { Router } from "express";
import { createCheckoutSession } from "../controllers/payments.controller.js";
import { checkRoles } from "../middlewares/access-control.middleware.js";


/**
 * Route pour gérer les webhooks de Stripe
 * Utilise le middleware 'raw' pour parser le corps de la requête en tant que Buffer
 * Ceci est nécessaire car Stripe nécessite le corps brut pour vérifier la signature du webhook
 */
const router = Router();

router.post(
  "/checkout-session", checkRoles(["member", "admin"]), createCheckoutSession);

export default router;