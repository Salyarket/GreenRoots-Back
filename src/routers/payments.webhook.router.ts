import { Router } from "express";
import { stripeWebhook } from "../controllers/payments.webhook.controller.js";

const router = Router();

// ici pas de json : le body est déjà raw via app.use("/payments/webhook", express.raw(...))
router.post("/", stripeWebhook);

export default router;
