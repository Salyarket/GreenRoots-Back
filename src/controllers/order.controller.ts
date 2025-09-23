import {
  createOrderSchema,
  updateOrderSchema,
} from "../schemas/order.schema.js";
import { NotFoundError } from "../lib/errors.js";
import { prisma } from "../models/index.js";
import { NextFunction, Request, Response } from "express";
import BaseController from "./base.controller.js";

const orderRelation = {
  user: true,
  items: { include: { product: true } },
};

class OrderController extends BaseController {
  constructor() {
    super(prisma.order, "order", createOrderSchema, orderRelation);
  }

  // CREATE an order
  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await createOrderSchema.parseAsync(req.body);

      const createdOrder = await this.model.create({
        data: {
          status: data.status,
          total: data.total,
          user: { connect: { id: data.userId } },
        },
      });

      res.status(201).json(createdOrder);
    } catch (error) {
      next(error);
    }
  };

  // UPDATE an order
  updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order_id = parseInt(req.params.id);
      const data = await updateOrderSchema.parseAsync(req.body);

      const foundOrder = await this.model.findUnique({
        where: { id: order_id },
      });
      if (!foundOrder) throw new NotFoundError(`Order not found: ${order_id}`);

      const updatedOrder = await this.model.update({
        where: { id: order_id },
        data: { ...data, updated_at: new Date() },
      });

      res.json(updatedOrder);
    } catch (error) {
      next(error);
    }
  };

  // récupérer les commandes d'un user
  getOrdersByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user_id = parseInt(req.params.id);
      const orders = await this.model.findMany({
        where: { user_id },
        include: this.relations,
      });
      res.json(orders);
    } catch (error) {
      next(error);
    }
  };

  //récupérer mes commandes
  getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = (req as any).userId; // injecté par le middleware JWT
      const orders = await this.model.findMany({
        where: { user_id },
        include: this.relations,
      });
      res.json(orders);
      // si pas d'order -> res.json vide (idem pour tout le fichier)
    } catch (error) {
      next(error);
    }
  };
}

export default new OrderController();
