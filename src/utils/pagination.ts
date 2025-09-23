import { z } from "zod";

export const Pagination= async (query: any) => {
  const schema = z.object({
    limit: z.coerce.number().int().min(1).max(100).optional().default(8),
    page: z.coerce.number().int().min(1).optional().default(1),
    order: z.enum(["name:asc", "name:desc"]).optional().default("name:asc"),
  });

  return schema.parseAsync(query);
};