import { PrismaClient } from "@prisma/client";
import BaseController from "./base.controllers.js";
import { z } from "zod";

const prisma = new PrismaClient();

const userTypeSchema = z.object({
  code: z
    .string()
    .min(1, { message: "Le code est obligatoire" })
    .max(50, { message: "Le code ne doit pas dépasser 50 caractères" }),

  label: z
    .string()
    .min(1, { message: "Le libellé est obligatoire" })
    .max(255, { message: "Le libellé ne doit pas dépasser 255 caractères" }),

  tva_rate: z
    .number()
    .min(0, { message: "Le taux de TVA doit être positif" })
    .max(999.99, { message: "Le taux de TVA doit être inférieur à 1000" }),
});

class UserTypeController extends BaseController {
  constructor() {
    super(prisma.userType, "user-type", userTypeSchema);
  }
}

export default new UserTypeController();
