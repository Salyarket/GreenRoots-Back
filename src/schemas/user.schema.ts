import { z } from "zod";

// regex pas de chiffres dans firstname / lastname
const onlyLetters = /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/;

export const updateUserSchema = z.object({
  firstname: z.string().min(1).max(255).optional(),
  lastname: z.string().min(1).max(255).optional(),
  email: z.string().email().max(320).optional(),
  password: z.string().min(6).max(255).optional(),
  role: z.enum(["member", "admin"]).optional(),
  entity_name: z.string().max(255).optional(),
  userTypeId: z.number().int().positive().optional(),
});

export const registerSchema = z.object({
  firstname: z
    .string()
    .min(1, { message: "Le prénom est requis" })
    .max(255, { message: "Le prénom ne peut pas dépasser 255 caractères" })
    .regex(onlyLetters),

  lastname: z
    .string()
    .min(1, { message: "Le nom est requis" })
    .max(255, { message: "Le nom ne peut pas dépasser 255 caractères" })
    .regex(onlyLetters),

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

export const loginSchema = z.object({
  email: z
    .email({ message: "Adresse email invalide" })
    .max(320, { message: "L'email ne peut pas dépasser 320 caractères" }),

  password: z
    .string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .max(255, {
      message: "Le mot de passe ne peut pas dépasser 255 caractères",
    }),
});
