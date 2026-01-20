import { z } from "zod";

export const createOrderSchema = z.object({
  status: z.enum(["pending", "paid", "cancelled"] as const, {
    message: "Statut invalide :  pending, paid ou cancelled",
  }),
  total: z
    .number()
    .min(0, { message: "Le total doit être supérieur ou égal à 0" }),
  userId: z.number().refine((val) => val > 0, {
    message: "L'id de l'utilisateur doit être un nombre positif",
  }),
  items: z
    .array(
      z.object({
        productId: z.number().refine((val) => val > 0, {
          message: "L'id du produit doit être un nombre positif",
        }),
        quantity: z
          .number()
          .min(1, { message: "La quantité doit être au moins de 1" }),
        unitPrice: z
          .number()
          .min(0, { message: "Le prix unitaire doit être positif" }),
      })
    )
    .min(1, { message: "La commande doit contenir au moins un produit" }),
});

export const updateOrderSchema = z.object({
  status: z.enum(["pending", "paid", "cancelled"]).optional(),
  total: z.number().nonnegative().optional(),
});
