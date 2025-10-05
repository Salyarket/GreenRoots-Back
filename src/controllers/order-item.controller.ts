import { PrismaClient } from "@prisma/client";
import BaseController from "./base.controller.js";
import { orderItemSchema } from "../schemas/order-item.schema.js";
import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../lib/errors.js";

const prisma = new PrismaClient();

const orderItemRelation = {
  product: true,
};

class OrderItemController extends BaseController {
  constructor() {
    super(prisma.orderItem, "order-item", orderItemSchema, orderItemRelation);
  }

  getProductByOrderId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orderId = parseInt(req.params.id);
      if (isNaN(orderId)) throw new NotFoundError("ID de commande invalide");

      const items = await prisma.orderItem.findMany({
        where: { order_id: orderId },
        include: this.relations,
      });

      if (items.length === 0)
        throw new NotFoundError(
          `Aucun produit trouvé pour la commande ${orderId}`
        );

      res.json({
        success: true,
        message: `Produits récupérés avec succès pour la commande ${orderId}`,
        data: items,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new OrderItemController();
