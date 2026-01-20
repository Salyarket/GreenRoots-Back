import { Prisma, PrismaClient } from "@prisma/client";
import BaseController from "./base.controller.js";
import { parseIdFromParams } from "../utils/zod.js";
import { parseOrder } from "../utils/Parser.js";
import { Pagination } from "../schemas/pagination.schema.js";
import {
  idParamSchema,
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
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

class ProductController extends BaseController {
  constructor() {
    super(prisma.product, "product", productDbSchema);
  }

  // pour admin, récupère tous les produits meme ceux non available (pour info quand "produit = available = false" ca veut dire qu'on la soft deleted)
  getAllAvailableWithPagination = async (req: any, res: any, next: any) => {
    try {
      const { page, limit, sortBy, sortOrder } = await Pagination(req.query);

      const [items, total] = await Promise.all([
        this.model.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: parseOrder(sortBy, sortOrder),
          where: { available: true },
        }),
        this.model.count({ where: { available: true } }),
      ]);

      return res.json({
        data: items,
        pagination_State: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
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
      // 1) Validation des données brutes
      const data = await productSchemaForCreate.parseAsync(req.body);

      // 2) Création du slug à partir du nom du produit
      const dataWithSlug = TextToSlugCreate(data);

      // 3) Ajout des chemins pour accéder aux images
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
    } catch (error: any) {
      if (error.code === "P2002") {
        return res
          .status(409)
          .json({ error: "Slug déjà utilisé, choisissez un autre nom" });
      }
      console.error(error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };

  updateProduct = async (req: any, res: any) => {
    try {
      // 1) ID valide
      const productId = Number(req.params.id);
      if (Number.isNaN(productId)) {
        return res.status(400).json({ error: "Id du produit invalide" });
      }

      // 2) Valider le body (ne prends que ce que ton schema autorise)
      const parsed = await productSchemaForUpdate.parseAsync(req.body);

      // 3) Charger l’existant
      const existing = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!existing)
        return res.status(404).json({ error: "Produit non trouvé" });

      // 4) Mettre à jour le slug si name a changé
      const withSlug = TextToSlugUpdate(existing, parsed);

      // 5) Gestion des images si de nouveaux fichiers ont été envoyés
      const files = (req.files as Express.Multer.File[]) ?? [];
      let newImageUrls: string[] | undefined;

      if (files.length > 0) {
        // a) supprimer les anciennes images du disque
        for (const p of existing.image_urls ?? []) {
          // normaliser et construire le chemin absolu
          const normalized = p.replace(/\\/g, "/");
          const fullPath = path.isAbsolute(normalized)
            ? normalized
            : path.join(process.cwd(), normalized);

          try {
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
          } catch (e) {
            // log soft, on continue quand même
            console.warn("Suppression fichier échouée:", fullPath, e);
          }
        }

        // b) remplacer par les nouvelles (on stocke le path tel que Multer l’a écrit)
        newImageUrls = files.map((f) => f.path.replace(/\\/g, "/"));
      }

      // 6) Construire un objet **propre** pour Prisma (pas de replace_images, etc...)
      const updateData: Prisma.ProductUpdateInput = {
        name: withSlug.name,
        slug: withSlug.slug,
        price: withSlug.price as any, // Décimale compatible : string | number | Prisma.Decimal
        description: withSlug.description,
        available: withSlug.available,
        stock: withSlug.stock,
        scientific_name:
          withSlug.scientific_name && withSlug.scientific_name.trim() !== ""
            ? withSlug.scientific_name
            : null,
        carbon: withSlug.carbon ?? null,
        ...(newImageUrls ? { image_urls: newImageUrls } : {}), // on ne touche pas si pas de nouvelles images
      };

      // 7) Update DB
      const updated = await prisma.product.update({
        where: { id: productId },
        data: updateData,
      });

      return res.status(200).json(updated);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json(error.issues);
      }
      if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
        return res.status(409).json({ error: "Slug déjà utilisé" });
      }
      console.error(error);
      return res.status(500).json({ error: "Erreur serveur" });
    }
  };

  deleteProduct = async (req: any, res: any) => {
    try {
      // 1) Vérifier que l'id est bien un nombre
      const productId = Number(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ error: "Id du produit invalide" });
      }

      // 2) Récupérer le produit existant pour accéder aux images
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { image_urls: true },
      });

      if (!product) {
        return res.status(404).json({ error: "Produit non trouvé" });
      }

      // 3) Supprimer les fichiers images associés
      if (product.image_urls?.length) {
        try {
          await deleteFiles(product.image_urls);
        } catch (fileError) {
          console.error(
            "impossible de supprimer le ou les fichiers:",
            fileError
          );
          // Attention : erreur indiquée mais on continue la suppression en DB (a voir si return)
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
      console.error("Erreur Prisma deleteProduct:", error);

      if (error.code === "P2025") {
        return res.status(404).json({ error: "Produit non trouvé" });
      }
      res.status(500).json({
        error: "Erreur Serveur controller delete product",
        details: error.message,
      });
    }
  };

  // soft delete le product avec un archive (available = false) donc on le sort du catalogue mais on garde une trace d'historique pour garder la ligne des commandes du client
  archiveProduct = async (req: any, res: any) => {
    try {
      const { id } = idParamSchema.parse(req.params);

      const updated = await prisma.product.update({
        where: { id },
        data: { available: false },
      });

      res.json({
        message: `Produit ${updated.name} (id ${updated.id}) archivé avec succès`,
        product: updated,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Id du produit invalide" });
      }
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Produit non trouvé" });
      }
      console.error(error);
      res.status(500).json({ error: "Erreur serveur soft delete" });
    }
  };
}

export default new ProductController();
