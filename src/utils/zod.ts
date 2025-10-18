import z from "zod";
// TARIG REVOIR
export async function parseIdFromParams(id: unknown) {
  return await z.coerce.number().int().min(1).parseAsync(id);
}
