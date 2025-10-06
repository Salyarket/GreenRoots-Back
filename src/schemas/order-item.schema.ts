import { z } from "zod";

export const orderItemSchema = z.object({
  order_id: z.number().int({ message: "order_id doit être un entier" }),
  product_id: z.number().int({ message: "product_id doit être un entier" }),
  quantity: z
    .number()
    .int({ message: "quantity doit être un entier" })
    .min(1, { message: "La quantité doit être au moins 1" }),
  unit_price: z
    .number()
    .min(0, { message: "Le prix unitaire doit être positif" })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toFixed(2)), {
      message: "Le prix doit avoir au maximum deux décimales",
    }),
});
