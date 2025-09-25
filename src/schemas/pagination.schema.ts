import { z } from "zod";

export const Pagination= async (query: any) => {
  const schema = z.object({
    limit: z.coerce.number().int().min(1).max(100).optional().default(8),
    page: z.coerce.number().int().min(1).optional().default(1),
    // On peut restreindre à certains champs avec z.enum si besoin enum(["name:asc", "name:desc", "firstname:asc", "firstname:desc"])
    sortBy: z.string().optional(), 
    sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
  });

  return schema.parseAsync(query);
};