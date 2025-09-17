import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export default class BaseController {
  model: any;
  modelName: string;

  constructor(model: any, modelName: string) {
    this.model = model; // va récuperer prisma.location
    this.modelName = modelName;
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const items = await this.model.findMany();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: `Failed to fetch ${this.modelName}` });
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const itemId = parseInt(req.params.id);
      const item = await this.model.findUnique({
        where: {
          id: itemId,
        },
      });
      if (!item) {
        return res
          .status(404)
          .json({ error: `This ${this.modelName} does not exist` });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: `Failed to fetch ${this.modelName}` });
    }
  };
}
