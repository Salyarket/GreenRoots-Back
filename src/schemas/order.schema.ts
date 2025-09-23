import { z } from "zod";

export const createOrderSchema = z.object({
  status: z.enum(["pending", "paid", "cancelled"]),
  total: z.number().nonnegative(),
  userId: z.number().int().positive(),
});

export const updateOrderSchema = z.object({
  status: z.enum(["pending", "paid", "cancelled"]).optional(),
  total: z.number().nonnegative().optional(),
});
