import { Request, Response } from "express";
import { prisma } from "../models/index.js";
import { z } from "zod";
import { parseIdFromParams } from "./utils.js";
import { deleteFiles } from "../utils/imgUpload.js";
import slugify from "slugify";


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


// const transformWith2Decimal = z.number().transform((val) =>
//   Math.round(val * 100) / 100
// //   { message: "Doit avoir au maximum 2 décimales" }
// );

const toNumberWith2Decimals = (val: unknown) =>
  val !== null && val !== undefined ? parseFloat(Number(val).toFixed(2)) : null;

export async function createProduct(req: Request, res: Response) {
  
  // --! Eventuellement revoir le dictionnaire de données afin de mettre une contrainte d'unicité sur le nom (meilleur lisibilité client et pas de doublon de création de slug)

  const createProductBodySchema = z.object({
    name: z.string().min(1).max(255),
    slug: z.string().max(255).optional(),
    price:  z.preprocess(
      (val: unknown) => (val !== "" ? toNumberWith2Decimals(val) : 0.0),
      z.number()
    ),
    description: z.string().min(1).max(2500),
    image_urls: z.preprocess(
      (val: unknown) => {
        if (typeof val === "string") {
          return val.split(",").map((s) => s.trim());
        }
        return val ?? [];
      },
      z.array(z.string()).max(100)
    ),
    available: z.preprocess(
      (val: unknown) => val === "true" || val === true,
      z.boolean()
    ),
    stock: z.preprocess(
      (val: unknown) => (val !== "" ? Number(val) : 0),
      z.number().int().nonnegative().default(0)
    ),
    scientific_name: z.string().max(255).nullable().optional(),
    carbon: z.preprocess(
      (val: unknown) => (val !== "" && val !== null ? toNumberWith2Decimals(val) : null),
      z.number().nullable().optional()
    ),
  });
  

  const { name, slug, price, description, available, stock, scientific_name, carbon } = await createProductBodySchema.parseAsync(req.body);

  // générer le slug à partir du name si pas fourni
  const slugValue = slug && slug.trim() !== ""
    ? slugify(slug, { lower: true, strict: true })
    : slugify(name, { lower: true, strict: true });

  // récupérer les fichiers uploadés
  const files = req.files as Express.Multer.File[];

  // Vérifier le nombre de fichiers uploadés
  if (files && files.length > 3) {
    return res.status(400).json({ error: "Vous ne pouvez uploader que 3 images maximum" });
  }

  const image_paths = files ? files.map((file) => file.path) : []; 

  const product = await prisma.product.create({ data: {
    name,
    slug: slugValue,
    price,
    description,
    image_urls : image_paths,
    available,
    stock,
    scientific_name,
    carbon
  }});

  res.status(201).json(product);
}

// A faire : 
// - Limiter à 3 le nombre maximum d'image uploadable 

export async function updateProduct(req: Request, res: Response) {
  try {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // Validation Zod avec champs optionnels
    const updateProductBodySchema = z.object({
      name: z.string().min(1).max(255).optional(),
      slug: z.string().max(255).optional(),
      price: z.preprocess(
        (val) => {
          if (val === null || val === undefined || val === "") return undefined; // ignore null ou vide
          const num = toNumberWith2Decimals(val);
          return isNaN(num) ? undefined : num;
        },
        z.number().optional()
      ),
      description: z.string().min(1).max(2500).optional(),
      image_urls: z.preprocess(
        (val) => {
          if (typeof val === "string") return val.split(",").map((s) => s.trim());
          return val ?? undefined;
        },
        z.array(z.string()).max(100).optional()
      ),
      replace_images: z.preprocess(
        (val) => val === "true" || val === true,
        z.boolean().optional()
      ),
      available: z.preprocess(
        (val) =>
          val === "true" || val === true
            ? true
            : val === "false"
              ? false
              : undefined,
        z.boolean().optional()
      ),
      stock: z.preprocess(
        (val) => {
          const num = Number(val);
          return Number.isInteger(num) && num >= 0 ? num : undefined;
        },
        z.number().int().nonnegative().optional()
      ),
      scientific_name: z.string().max(255).nullable().optional(),
      carbon: z.preprocess(
        (val) =>
          val !== "" && val !== null && val !== undefined
            ? toNumberWith2Decimals(val)
            : undefined,
        z.number().nullable().optional()
      ),
    });

    const data = await updateProductBodySchema.parseAsync(req.body);

    // Séparer replace_images du reste des données pour Prisma
    const { replace_images, ...prismaData } = data;

    // Charger le produit existant pour comparer name/slug
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Si name est modifié et slug non fourni → générer un nouveau slug
    if (prismaData.name && !prismaData.slug) {
      if (prismaData.name !== existingProduct.name) {
        prismaData.slug = slugify(prismaData.name, {
          lower: true,
          strict: true,
          trim: true,
        });
      }
    }

    // Récupération des fichiers uploadés
    const files = req.files as Express.Multer.File[];
    const newImagePaths = files ? files.map((file) => file.path) : [];

    // ajout ou remplacement des images
    if (newImagePaths.length > 0) {
      if (replace_images) {
        // Remplacer complètement les images existantes
        if (newImagePaths.length > 3) {
          return res.status(400).json({ error: "Vous ne pouvez ajouter que 3 images maximum" });
        }
        prismaData.image_urls = newImagePaths;
      } else {
        // Ajouter aux images existantes
        const existingProduct = await prisma.product.findUnique({
          where: { id: productId },
          select: { image_urls: true },
        });
        if (existingProduct! && existingProduct.image_urls.length + newImagePaths.length > 3){
          return res.status(400).json({ error: `Vous pouvez seulement ajouter ${3 - existingProduct.image_urls.length} image(s)` });
        }
        prismaData.image_urls = [...(existingProduct?.image_urls || []), ...newImagePaths];
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: prismaData,
    });

    res.status(200).json(updatedProduct);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json(error.issues);
    }
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export async function deleteProduct(req: Request, res: Response) {
  try {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // Récupérer le produit pour obtenir les images
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { image_urls: true },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Supprimer les images du dossier uploads
    if (product.image_urls && product.image_urls.length > 0) {
      await deleteFiles(product.image_urls);
    }

    // Supprimer le produit en base
    await prisma.product.delete({
      where: { id: productId },
    });

    res.status(204).send(); // No Content
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Product not found" });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
