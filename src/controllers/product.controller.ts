import { PrismaClient } from "@prisma/client";
import BaseController from "./base.controller.js";
import { parseIdFromParams } from "../utils/zod.js";
import { Pagination } from "../utils/pagination.js";
import {
  productDbSchema,
  productSchemaForCreate,
  productSchemaForUpdate,
} from "../schemas/product.schema.js";
import {
  ImgCreatePath,
  ImgUpdatePath,
  deleteFiles,
} from "../utils/imgUpload.js";
import { TextToSlugCreate, TextToSlugUpdate } from "../utils/TextToSlug.js";

const prisma = new PrismaClient();

class ProductController extends BaseController {
  constructor() {
    super(prisma.product, "product", productDbSchema);
  }

  // Pour tester avec postman :
  // GET http://localhost:3000/products/pagination?limit=5&page=2&order=name:desc
  // GET http://localhost:3000/products/pagination?limit=5&page=2&order=name:asc
  getProductsWithPagination = async (req: Request, res: Response) => {
    // Reste à faire : Les filtres par prix, localisation, carbon ...

    try {
      const { page, limit, order } = await Pagination(req.query);

      const products = await prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: order === "name:asc" ? { name: "asc" } : { name: "desc" },
      });

      const total = await prisma.product.count();

      return res.json({
        data: products,
      pagination_State: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / liclearmit),
        },
      });
    } catch (error) {
      return res.status(400).json({
        error: "Paramètres de recherche non valide",
        details: error,
      });
    }
  };

  getOneProductWithLocations = async (req: any, res: any) => {
    const productId = await parseIdFromParams(req.params.id);

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
                longitude: true,
              },
            },
          },
        },
      },
    });

    res.json(product);
  };

  createProduct = async (req: any, res: any) => {
    try {
      // 1. Validation des données brutes
      const data = await productSchemaForCreate.parseAsync(req.body);

      // 2. Création du slug à partir du nom du produit
      const dataWithSlug = TextToSlugCreate(data);

      // 3. Ajout des chemins pour accéder aux images
      const imgPath = ImgCreatePath(
        dataWithSlug,
        req.files as Express.Multer.File[]
      );

      // 4. Vérification du nombre d’images
      if (imgPath.image_urls.length > 3) {
        return res
          .status(400)
          .json({ error: "Vous ne pouvez uploader que 3 images maximum" });
      }

      const product = await prisma.product.create({ data: imgPath });

      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "données invalides" });
    }
  };

  updateProduct = async (req: any, res: any) => {
    try {
      // 1. Vérifier que l'id est bien un nombre
      const productId = Number(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Id du produit invalide" });
      }

      // 2. Validation du body
      const data = await productSchemaForUpdate.parseAsync(req.body);

      // 3. Charger le produit existant pour le traitement du slug et des images
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!existingProduct) {
        return res.status(404).json({ error: "Produit non trouvé" });
      }

      // 4. Addapter le slug si le nom du produit change
      const dataWithSlug = TextToSlugUpdate(existingProduct, data);

      // 5. Remplacer ou ajouter des images
      const dataWithImg = ImgUpdatePath(
        existingProduct,
        dataWithSlug,
        req.files as Express.Multer.File[]
      );

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: dataWithImg,
      });

      res.status(200).json(updatedProduct);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json(error.issues);
      }
      if (error.message?.includes("image")) {
        return res.status(400).json({ error: error.message });
      }
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Produit non trouvé" });
      }
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };

  deleteProduct = async (req: any, res: any) => {
    try {
      // 1. Vérifier que l'id est bien un nombre
      const productId = Number(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Id du produit invalide" });
      }

      // 2.  Récupérer le produit existant pour accéder aux images
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { image_urls: true },
      });

      if (!product) {
        return res.status(404).json({ error: "Produit non trouvé" });
      }

      // 3. Supprimer les fichiers images associés
      if (product.image_urls?.length) {
        try {
          await deleteFiles(product.image_urls);
        } catch (fileError) {
          console.error(
            "impossible de supprimer le ou les fichiers:",
            fileError
          );
          // Attention : erreur indiqué mais on continue la suppression en DB (a voir si return)
        }
      }

      await prisma.product.delete({
        where: { id: productId },
      });

      // Réponse : succès mais pas de contenu à favoriser en production
      // res.status(204).send();
      res.status(200).json({
        message: "Le produit a bien été supprimé avec ses images",
        deletedImages: product.image_urls,
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Produit non trouvé" });
      }
      console.error(error);
      res.status(500).json({ error: "Erreur Serveur" });
    }
  };
}

export default new ProductController();
