import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

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
}
