import {
  createOrderSchema,
  updateOrderSchema,
} from "../schemas/order.schema.js";
import {
  BadRequestError,
  HttpClientError,
  NotFoundError,
} from "../lib/errors.js";
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

  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await createOrderSchema.parseAsync(req.body);

      const productIds = data.items.map((i) => i.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, stock: true, name: true },
      });

      const insufficientStock = data.items.filter((item) => {
        const product = products.find((p) => p.id === item.productId);
        return !product || product.stock < item.quantity;
      });

      if (insufficientStock.length > 0) {
        const message = insufficientStock
          .map((item) => {
            const p = products.find((p) => p.id === item.productId);
            return `${
              p?.name || "Produit inconnu"
            } - stock insuffisant (demande: ${item.quantity}, stock: ${
              p?.stock
            })`;
          })
          .join(", ");

        throw new BadRequestError(message);
      }

      // Une transaction en base de données, c’est un ensemble d’opérations qui doivent toutes réussir ou toutes échouer. (on ne veut surtout pas valider la commande si un seul des produits n'est pas dispo)
      const createdOrder = await prisma.$transaction(async (tx) => {
        // tx est une “connexion transactionnelle” fournie par Prisma.
        // tx est comme une version temporaire de prisma qui travaille dans une transaction.
        // Si une seule mise à jour échoue (ex. stock négatif, contrainte en BDD, etc.), tout est annulé :
        // la commande n’est pas créée, le stock n’est pas modifié.
        const order = await tx.order.create({
          data: {
            status: data.status,
            total: data.total,
            user: { connect: { id: data.userId } },
            items: {
              create: data.items.map((item) => ({
                product_id: item.productId,
                quantity: item.quantity,
                unit_price: item.unitPrice,
              })),
            },
          },
          include: { items: true, user: true },
        });

        for (const item of data.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        return order;
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
        data,
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
