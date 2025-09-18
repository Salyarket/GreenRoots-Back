import { createOrderSchema, updateOrderSchema } from "../schemas/order.schema.js";
import { NotFoundError } from "../lib/errors.js";
import { prisma } from "../models/index.js";
import { Request, Response } from "express";

// GET all orders
export async function getAllOrders(req: Request, res: Response) {
  const orders = await prisma.order.findMany({
    where: { user_id: parseInt(req.params.id) },
    include: { items: { include: { product: true } } },
  });
  res.json(orders);
}

// GET one order
export async function getOneOrder(req: Request, res: Response) {
  const order_id = parseInt(req.params.id);

  const order = await prisma.order.findUnique({
    where: { id: order_id },
    include: {
      user: { include: { userType: true } },
      items: { include: { product: true } },
    },
  });

  if (!order) throw new NotFoundError(`Order not found: ${order_id}`);

  res.json(order);
}

// CREATE an order
export async function createOrder(req: Request, res: Response) {
  const data = await createOrderSchema.parseAsync(req.body);

  const createdOrder = await prisma.order.create({
    data: {
      status: data.status,
      total: data.total,
      user: { connect: { id: data.userId } },
    },
  });

  res.status(201).json(createdOrder);
}

// UPDATE an order
export async function updateOrder(req: Request, res: Response) {
  const order_id = parseInt(req.params.id);
  const data = await updateOrderSchema.parseAsync(req.body);

  const foundOrder = await prisma.order.findUnique({ where: { id: order_id } });
  if (!foundOrder) throw new NotFoundError(`Order not found: ${order_id}`);

  const updatedOrder = await prisma.order.update({
    where: { id: order_id },
    data: { ...data, updated_at: new Date() },
  });

  res.json(updatedOrder);
}

// DELETE an order
export async function deleteOrder(req: Request, res: Response) {
  const order_id = parseInt(req.params.id);

  const order = await prisma.order.findUnique({ where: { id: order_id } });
  if (!order) throw new NotFoundError(`Order not found: ${order_id}`);

  await prisma.order.delete({ where: { id: order_id } });

  res.status(204).end();
}

export async function getOrdersByUserId(req: Request, res: Response) {
  const user_id = parseInt(req.params.id);
  const orders = await prisma.order.findMany({
    where: { user_id },
    include: { items: { include: { product: true } } },
  });
  res.json(orders);
}

export async function getMyOrders(req: Request, res: Response) {
  const user_id = (req as any).userId; // injecté par le middleware JWT
  const orders = await prisma.order.findMany({
    where: { user_id },
    include: { items: { include: { product: true } } },
  });
  res.json(orders);
}