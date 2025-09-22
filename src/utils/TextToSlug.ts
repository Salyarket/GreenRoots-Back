import slugify from "slugify";
import { z } from "zod";
import { productSchemaForCreate, productSchemaForUpdate } from "../schemas/product.schema.js";

export function TextToSlugCreate(
  data: z.infer<typeof productSchemaForCreate>
) {
  return {
    ...data,
    slug:
      data.slug && data.slug.trim() !== ""
        ? slugify(data.slug, { lower: true, strict: true })
        : slugify(data.name, { lower: true, strict: true }),
  };
}

// Update
export function TextToSlugUpdate(
  existing: { name: string; slug: string },
  data: z.infer<typeof productSchemaForUpdate>,
) {

  const updated = data; 
  // let updated = { ...rest  };

  // Si name modifié et slug absent → regénérer slug
  if (updated.name && !updated.slug) {
    if (updated.name !== existing.name) {
      updated.slug = slugify(updated.name, {
        lower: true,
        strict: true,
        trim: true,
      });
    }
  }

  return updated;
}