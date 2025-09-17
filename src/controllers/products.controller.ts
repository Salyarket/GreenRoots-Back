import { Request, Response } from "express";
import { prisma } from "../models/index.js";
import z from "zod";
import { parseIdFromParams } from "./utils.js";

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

export async function getOneProduct(req: Request, res: Response) {
  // Get ID from params
  const productId = await parseIdFromParams(req.params.id);

  // Query database
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      productLocations: {
        include: {
          location: {
            select: {
              id: true,
              name: true,
              latitude: true,
              longitude: true
            }
          }
        }
      }
    }
  });

  res.json(product);
}


const transformWith2Decimal = z.number().transform((val) =>
  Math.round(val * 100) / 100
//   { message: "Doit avoir au maximum 2 décimales" }
);

export async function createProduct(req: Request, res: Response) {
  
// --! Tester si c'est la longueur du tableau ou d'un élément du tableau que zod check 
// --! ajouter une fonction qui transforme le nom en slug 

  // Body validation with optional properties
  const createProductBodySchema = z.object({
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(255),
    price:  transformWith2Decimal.default(0.0),
    description: z.string().min(1).max(2500),
    image_urls: z.array(z.string()).max(100),
    available: z.boolean().default(true),
    stock: z.number().int().nonnegative().default(0),
    scientific_name: z.string().max(255).nullable().optional(),
    carbon: transformWith2Decimal.nullable().optional(),
  });

  const { name, slug, price, description, image_urls, available, stock, scientific_name, carbon } = await createProductBodySchema.parseAsync(req.body);

  const product = await prisma.product.create({ data: {
    name,
    slug,
    price,
    description,
    image_urls,
    available,
    stock,
    scientific_name,
    carbon
  }});

  res.status(201).json(product);
}

export async function updateProduct(req: Request, res: Response) {

  const productId = await parseIdFromParams(req.params.id);

// --! ajouter une fonction qui transforme le nom en slug si celui-ci est changé

  const { name, slug, price, description, image_urls, available, stock, scientific_name, carbon } = await z.object({
    name: z.string().min(1).max(255).optional(),
    slug: z.string().min(1).max(255).optional(),
    price:  transformWith2Decimal.default(0.0).optional(),
    description: z.string().min(1).max(2500).optional(),
    image_urls: z.array(z.string()).max(100).optional(),
    available: z.boolean().default(true).optional(),
    stock: z.number().int().nonnegative().default(0).optional(),
    scientific_name: z.string().max(255).nullable().optional().optional(),
    carbon: transformWith2Decimal.nullable().optional().optional(),
  }).parseAsync(req.body);

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      ...(name && { name }),
      ...(slug && { slug }),
      ...(price && { price }),
      ...(description && { description }),
      ...(image_urls && { image_urls }),
      ...(available && { available }),
      ...(stock && { stock }),
      ...(scientific_name && { scientific_name }),
      ...(carbon && { carbon }),
    }
  });

  // Respond to client
  res.json(updatedProduct);
}


export async function deleteProduct(req: Request, res: Response) {
  const productId = await parseIdFromParams(req.params.id);

  await prisma.product.delete({ where: { id: productId } });
  res.status(204).json();
}

