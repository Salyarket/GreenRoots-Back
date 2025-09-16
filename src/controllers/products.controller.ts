import { Request, Response } from "express";
import { prisma } from "../models/index.js";
import z from "zod";

//   id              Int       @id @default(autoincrement())
//   name            String    @db.VarChar(255)
//   slug            String    @unique @db.VarChar(255)
//   price           Decimal   @default(0.0) @db.Decimal(10, 2)
//   description     String    @db.VarChar(2500)
//   image_urls      String[]  @db.VarChar(100) 
//   available       Boolean   @default(true)
//   stock           Int       @default(0)
//   scientific_name  String?   @db.VarChar(255) 
//   carbon          Decimal?  @db.Decimal(10, 2)
//   created_at   DateTime  @default(now()) 
//   updated_at   DateTime  @default(now()) 


export async function getAllProducts(req: Request, res: Response) {

//   Query params permettant la gestion de la pagination (limit + page) et le trie Asc ou Desc (optionnel)
//   exemple de query params => /products?limit=10&page=2&order=name:asc  

  const { page, limit, order } = await z.object({
    limit: z.coerce.number().int().min(1).optional().default(8),
    page: z.coerce.number().int().min(1).optional().default(1),
    order: z.enum(["name:asc", "name:desc"]).default("name:asc").optional(),
  }).parseAsync(req.query);

  // Get products from database
  const products = await prisma.product.findMany({
    ...(page && { skip: (page - 1) * limit }),
    ...(limit && { take: limit }),
    orderBy: [
      (order === "name:asc") ? { name: "asc" } : {},
      (order === "name:desc") ? { name: "desc" } : {},
    ]
  });

  res.json(products);
}
