import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

// Créer une session de paiement Stripe Checkout pour une commande donnée
export async function createCheckoutSession(req: any, res: any, next: any) {
  try {
    const { orderId } = req.body;
    const userId = req.userId;

    if (!orderId) return res.status(400).json({ error: "orderId manquant" });
    if (!userId) return res.status(401).json({ error: "Non authentifié" });

    // Charger la commande + produits depuis la BDD
    const order = await prisma.order.findFirst({
      where: { id: Number(orderId), user_id: Number(userId) },
      include: { items: { include: { product: true } } },
    });

    if (!order) return res.status(404).json({ error: "Commande introuvable" });

    // Construire les line_items ou "les lignes de la facture" (depuis la BDD : jamais depuis le front no trust à ce que le navigateur envoie)
    const line_items = order.items.map((it: any) => {
      const price = Number(it.product.price); // si "Decimal" de Prisma, on force la conversion avec Number()
      if (!Number.isFinite(price)) throw new Error("Prix produit invalide");

      return {
        quantity: it.quantity,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(price * 100),
          product_data: { name: it.product.name },
        },
      };
    });

    // Session Checkout
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/checkout/cancel`,
      metadata: {
        orderId: String(order.id),
        userId: String(userId),
      },
    });

    return res.json({ url: session.url });
  } catch (err) {
    return next(err);
  }
}
