import { Request, Response } from "express";
import { ZodType } from "zod";

export default class BaseController {
  model: any;
  modelName: string;
  schema?: ZodType;

  constructor(model: any, modelName: string, schema?: ZodType) {
    this.model = model; // va récuperer prisma.location, prisma.order, etc
    this.modelName = modelName;
    this.schema = schema;
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const items = await this.model.findMany();
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: `Failed to fetch ${this.modelName}` });
    }
  };

  getById = async (req: Request, res: Response) => {
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
      console.error(error);
      res.status(500).json({ error: `Failed to fetch ${this.modelName}` });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const validatedData = this.schema
        ? this.schema.parse(req.body)
        : req.body;
      const newItem = await this.model.create({
        data: validatedData,
      });
      res.status(201).json(newItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: `Failed to create ${this.modelName}` });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const itemId = parseInt(req.params.id);
      const validatedData = this.schema
        ? this.schema.parse(req.body)
        : req.body;
      const updatedItem = await this.model.update({
        where: {
          id: itemId,
        },
        data: validatedData,
      });
      res.json(updatedItem);
    } catch (error: any) {
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ error: `${this.modelName} is not found` });
      }
      res.status(500).json({ error: `Failed to update ${this.modelName}` });
    }
  };

  deleteById = async (req: Request, res: Response) => {
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
    } catch (error: any) {
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ error: `${this.modelName} is not found` });
      }
      res.status(500).json({ error: `Failed to delete ${this.modelName}` });
    }
  };
}
