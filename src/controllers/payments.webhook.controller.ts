import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const prisma = new PrismaClient();

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const EMAILJS_SERVICE_ID =
  process.env.EMAILJS_SERVICE_ID ?? process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID =
  process.env.EMAILJS_TEMPLATE_ORDER_CONFIRM_ID ??
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ORDER_CONFIRM_ID;
const EMAILJS_PUBLIC_KEY =
  process.env.EMAILJS_PUBLIC_KEY ?? process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

type OrderEmailData = {
  id: number;
  total: number;
  user: {
    email: string;
    firstname: string;
    lastname: string;
  };
  items: Array<{
    quantity: number;
    unit_price: number;
    product?: { name: string };
  }>;
};

async function sendOrderConfirmationEmail(order: OrderEmailData) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.error("EmailJS config missing", {
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      EMAILJS_PUBLIC_KEY: EMAILJS_PUBLIC_KEY ? "set" : "missing",
    });
    return;
  }

  try {
    const tvaRate = 0.2;
    const tva = +(order.total * tvaRate / (1 + tvaRate)).toFixed(2);

    const templateParams = {
      email: order.user.email,
      user_firstname: order.user.firstname,
      user_lastname: order.user.lastname,
      order_id: String(order.id),
      orders: order.items.map((item) => ({
        name: item.product?.name ?? "Produit",
        quantity: item.quantity,
        price: Number(item.unit_price),
      })),
      tva,
      total: +order.total.toFixed(2),
    };

    console.log("EmailJS send start", {
      orderId: order.id,
      email: order.user.email,
    });

    const res = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: templateParams,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("EmailJS send failed:", res.status, errText);
    } else {
      console.log("EmailJS send ok", { orderId: order.id });
    }
  } catch (error) {
    console.error("EmailJS send error", error);
  }
}

export async function stripeWebhook(req: any, res: any) {
  const sig = req.headers["stripe-signature"];
  console.log("Stripe webhook received", { hasSignature: Boolean(sig) });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Stripe webhook constructEvent failed", err?.message ?? err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = Number(session.metadata?.orderId);

    console.log("Stripe webhook checkout.session.completed", { orderId });

    if (Number.isFinite(orderId)) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: { select: { email: true, firstname: true, lastname: true } },
          items: { include: { product: { select: { name: true } } } },
        },
      });

      if (!order) {
        console.error("Order not found for webhook", { orderId });
      } else if (order.status !== "paid") {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "paid" },
          //paidAt: new Date(), // vérifier si on a ce champ et l'intégrer à Data le cas échéant
        });

        await sendOrderConfirmationEmail({
          id: order.id,
          total: Number(order.total),
          user: order.user,
          items: order.items.map((item) => ({
            quantity: item.quantity,
            unit_price: Number(item.unit_price),
            product: item.product ?? undefined,
          })),
        });
      } else {
        console.log("Order already paid, skip email", { orderId });
      }
    }
  }
  return res.json({ received: true });
}

      
 




    
