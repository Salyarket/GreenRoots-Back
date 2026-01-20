export function parseOrder(sortBy?: string, sortOrder?: "asc" | "desc") {
  if (!sortBy) return undefined;
  return { [sortBy]: sortOrder || "asc" };
}