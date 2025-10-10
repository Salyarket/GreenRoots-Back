import { z } from "zod";

export const locationsSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nom requis" })
    .max(255, { message: "Nom trop long (max 255)" }),

  latitude: z
    .number({ message: "Latitude invalide" })
    .min(-90, { message: "Latitude ≥ -90" })
    .max(90, { message: "Latitude ≤ 90" }),

  longitude: z
    .number({ message: "Longitude invalide" })
    .min(-180, { message: "Longitude ≥ -180" })
    .max(180, { message: "Longitude ≤ 180" }),
});

export const locationProductSchema = z.object({
  product_id: z
    .number({ message: "ID produit invalide" })
    .int({ message: "ID produit entier requis" })
    .positive({ message: "ID produit > 0" }),
});
