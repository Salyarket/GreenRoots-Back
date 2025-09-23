import { z } from "zod";

// Les schémas addaptés en fonction des besoins GET / PATCH / POST / DELETE

// Schéma de de base 
export const productDbSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  price: z.number().min(0),
  description: z.string().min(1).max(2500),
  image_urls: z.array(z.string().max(255)).max(100),
  available: z.boolean().default(true),
  stock: z.number().int().min(0).default(0),
  scientific_name: z.string().max(255).nullable().optional(),
  carbon: z.number().min(0).nullable().optional(),
});

const toNumberWith2Decimals = (val: unknown) =>
  val !== null && val !== undefined ? parseFloat(Number(val).toFixed(2)) : null;

// Schéma de pour la création d'un produit
export const productSchemaForCreate = productDbSchema.extend({
  slug: z.string().max(255).optional(),
  price: z.preprocess(
    (val) => (val !== "" ? toNumberWith2Decimals(val) : 0.0),
    z.number().min(0)
  ),
  image_urls: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return val.split(",").map((s) => s.trim());
      }
      return val ?? [];
    },
    z.array(z.string()).max(100)
  ),
  available: z.preprocess((val) => val === "true" || val === true, z.boolean()),
  stock: z.preprocess(
    (val) => (val !== "" ? Number(val) : 0),
    z.number().int().nonnegative().default(0)
  ),
  carbon: z.preprocess(
    (val) =>
      val !== "" && val !== null ? toNumberWith2Decimals(val) : null,
    z.number().nullable().optional()
  ),
});

// Schéma d’update : tous les champs optionnels + replace_images
export const productSchemaForUpdate = productSchemaForCreate
  .partial()
  .extend({
    replace_images: z.preprocess(
      (val) => val === "true" || val === true,
      z.boolean().optional()
    ),
  });