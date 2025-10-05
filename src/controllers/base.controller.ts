import { NextFunction, Request, Response } from "express";
import { ZodType, ZodObject } from "zod";
import { ConflictError, NotFoundError } from "../lib/errors.js";
import { Prisma } from "@prisma/client";
import { Pagination } from "../schemas/pagination.schema.js";
import { parseOrder } from "../utils/Parser.js";
import { log } from "console";

export default class BaseController {
  model: any;
  modelName: string;
  schema?: ZodType;
  relations?: any;

  constructor(
    model: any,
    modelName: string,
    schema?: ZodType,
    relations?: any
  ) {
    this.model = model; // va récuperer prisma.location, prisma.order, etc
    this.modelName = modelName;
    this.schema = schema;
    this.relations = relations; //stocke includes
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.model.findMany({
        include: this.relations,
      });
      res.json(items);
    } catch (error) {
      next(error); //global-error-handler se charge de la gestion d'erreur
    }
  };

  // Exemple avec product : GET http://localhost:3000//products/pagination?limit=5&page=2&sortBy=name&sortOrder=desc
  // Optionnel : le catalogue produit utilisera cette route pour fetch seulement les produits avalaible (dispo à la vente)
  //  l'admin utilisune autre route avec tous les produits dispos meme ceux supprimés (available=false) car on ne veut pas supprimer reelement le produit mais l'archiver
  getAllWithPagination = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit, sortBy, sortOrder } = await Pagination(req.query);

      const [items, total] = await Promise.all([
        this.model.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: parseOrder(sortBy, sortOrder),
        }),
        this.model.count(),
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

  getAllWithRelation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.model.findMany({
        include: this.relations,
      });

      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const itemId = parseInt(req.params.id);
      const item = await this.model.findUnique({
        where: {
          id: itemId,
        },
        include: this.relations,
      });
      if (!item)
        throw new NotFoundError(`This ${this.modelName} does not exist`);
      res.json(item);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = this.schema
        ? this.schema.parse(req.body)
        : req.body;
      const newItem = await this.model.create({
        data: validatedData,
      });
      res.status(201).json(newItem);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictError(`${this.modelName} already exists`);
        }
      }
      next(error);
    }
  };


  // Création : gestion de la table relationnelle
  createRelation =
    (relationName: string, relationFields: string[], schema?: any) =>
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { id } = req.params; // id de l'entité principale

          // validation Zod si schema fourni
          let validatedBody: any = req.body;
          if (schema) {
            validatedBody = schema.parse(req.body);
          }

          // Construction relationData
          const relationData: Record<string, any> = {};
          relationFields.forEach((field) => {
            relationData[field] = validatedBody[field];
          });

          // Update Prisma
          const updatedItem = await this.model.update({
            where: { id: Number(id) },
            data: {
              [relationName]: { create: relationData },
            },
            include: { [relationName]: true },
          });

          res.status(200).json(updatedItem);
        } catch (error: any) {
          // Gestion des erreurs Zod
          if (error.name === "ZodError") {
            return res.status(400).json({ message: error.errors });
          }

          next(error);
        }
      };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const itemId = parseInt(req.params.id);
      const validatedData =
        this.schema && this.schema instanceof ZodObject
          ? (this.schema as ZodObject<any>).partial().parse(req.body)
          : req.body;
      const updatedItem = await this.model.update({
        where: {
          id: itemId,
        },
        data: validatedData,
      });
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundError(`${this.modelName} not found`);
        }
        if (error.code === "P2002") {
          throw new ConflictError(`${this.modelName} already exists`);
        }
      }
      next(error);
    }
  };

  // Modification : gestion de la table relationnelle
  updateRelation =
    (relationName: string, compositeKey: string, schema?: any) =>
      async (req, res, next) => {
        try {
          const { id, relatedId } = req.params;
          let validatedBody = req.body;
          if (schema) validatedBody = schema.parse(req.body);

          const relationData: Record<string, any> = {};
          Object.keys(validatedBody).forEach((field) => {
            relationData[field] = validatedBody[field];
          });

          const updatedItem = await this.model.update({
            where: { id: Number(id) },
            data: {
              [relationName]: {
                update: {
                  where: { [compositeKey]: { product_id: Number(relatedId), location_id: Number(id) } },
                  data: relationData,
                },
              },
            },
            include: { [relationName]: true },
          });

          res.status(200).json(updatedItem);
        } catch (error) {
          if (error.name === "ZodError") return res.status(400).json({ message: error.errors });
          next(error);
        }
      };

  deleteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const itemId = parseInt(req.params.id);
      const deletedItem = await this.model.delete({
        where: {
          id: itemId,
        },
      });
      res.json({
        message: `${this.modelName} deleted successfully`,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new NotFoundError(`${this.modelName} not found`);
        }
      }
      next(error);
    }
  };

  // Supression : gestion de la table relationnelle
  removeRelation =
    (relationName: string, compositeKey: string) =>
      async (req, res, next) => {
        try {
          const { id, relatedId } = req.params;

          const updatedItem = await this.model.update({
            where: { id: Number(id) },
            data: {
              [relationName]: {
                delete: {
                  [compositeKey]: { product_id: Number(relatedId), location_id: Number(id) },
                },
              },
            },
            include: { [relationName]: true },
          });

          res.status(200).json(updatedItem);
        } catch (error) {
          next(error);
        }
      };
}

// Supression : gestion de la table relationnelle
