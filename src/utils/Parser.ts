// Transformation de "name:asc" venant de la query string en objet { name: "asc" } pour Prisma
// Exemple : si sortBy = "name" et sortOrder = "desc" → { name: "desc" }
// Exemple : si sortBy = "price" et sortOrder n’est pas défini → { price: "asc" } (valeur par défaut).

export function parseOrder(sortBy?: string, sortOrder?: "asc" | "desc") {
  if (!sortBy) return undefined;
  return { [sortBy]: sortOrder || "asc" };
}