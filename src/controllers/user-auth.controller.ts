import { PrismaClient } from "@prisma/client";
import AuthController from "./auth.controller.js";
import { z } from "zod";

const prisma = new PrismaClient();

const userSchema = z.object({
  firstname: z
    .string()
    .min(1, { message: "Le prénom est requis" })
    .max(255, { message: "Le prénom ne peut pas dépasser 255 caractères" }),

  lastname: z
    .string()
    .min(1, { message: "Le nom est requis" })
    .max(255, { message: "Le nom ne peut pas dépasser 255 caractères" }),

  email: z
    .email({ message: "Adresse email invalide" })
    .max(320, { message: "L'email ne peut pas dépasser 320 caractères" }),

  password: z
    .string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .max(255, {
      message: "Le mot de passe ne peut pas dépasser 255 caractères",
    }),

  role: z
    .enum(["member", "admin"], {
      message: "Le rôle doit être 'member' ou 'admin'",
    })
    .default("member"),

  user_type_id: z
    .number()
    .int({ message: "L'ID du type d'utilisateur doit être un entier" })
    .positive()
    .default(1),

  entity_name: z
    .string()
    .max(255, {
      message: "Le nom de l'entité ne peut pas dépasser 255 caractères",
    })
    .optional(),
});

class UserController extends AuthController {
  constructor() {
    super(prisma, "users", userSchema);
  }
}

export default new UserController();
