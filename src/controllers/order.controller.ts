import { ConflictError, NotFoundError } from "../lib/errors.js";
import { parseIdFromParams } from "./utils.js";
import { prisma } from "../models/index.js";
import { Request, Response } from "express";
import { z } from "zod";

// GET all orders
export async function getAllOrders(req: Request, res: Response) {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          include: { userType: true }, // type de l'utilisateur
        },
        items: {
          include: { product: true }, // détail des items + produit
        },
      },
    });
    res.json(orders);
  }
  
  // GET one order
  export async function getOneOrder(req: Request, res: Response) {
    const orderId = await parseIdFromParams(req.params.id);
  
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          include: { userType: true },
        },
        items: {
          include: { product: true },
        },
      },
    });
    if (!order) throw new NotFoundError("Order not found");
    res.json(order);
  }
  

// CREATE an order
export async function createOrder(req: Request, res: Response) {
  const createOrderBodySchema = z.object({
    status: z.enum(["pending", "paid", "cancelled"]),
    total: z.number().nonnegative(),
    userId: z.number().int().positive(),
  });

  const data = await createOrderBodySchema.parseAsync(req.body);

  const createdOrder = await prisma.order.create({ data: {
    status: data.status,
    total: data.total,
    user: { connect: { id: data.userId } },
  }, });

  res.status(201).json(createdOrder);
}

// UPDATE an order
export async function updateOrder(req: Request, res: Response) {
  const orderId = await z.coerce.number().int().min(1).parseAsync(req.params.id);

  const updateOrderBodySchema = z.object({
    status: z.enum(["pending", "paid", "cancelled"]).optional(),
    total: z.number().nonnegative().optional(),
  });

  const data = await updateOrderBodySchema.parseAsync(req.body);

  const foundOrder = await prisma.order.findUnique({ where: { id: orderId } });
  if (!foundOrder) throw new NotFoundError(`Order not found: ${orderId}`);

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { ...data, updated_at: new Date() },
  });

  res.json(updatedOrder);
}

// DELETE an order
export async function deleteOrder(req: Request, res: Response) {
  const orderId = await parseIdFromParams(req.params.id);

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new NotFoundError("Order not found");

  await prisma.order.delete({ where: { id: orderId } });

  res.status(204).end();
}


//quand le client sera connecté :
// import { Role } from "../models/generated/client"; 
// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { ForbiddenError, UnauthorizedError } from "../lib/errors"; 
// import { config } from "../../config"; 

// // payload jwt attendu
// interface MyJWTPayload {
//   userId: number;
//   role: Role;
// }

// export function checkRoles(roles: Role[]) {
//   return (req: Request, res: Response, next: NextFunction) => {
//     // extraction du token
//     const token = extractAccessToken(req);

//     // vérification et décode
//     const { userId, role } = verifyAndDecodeJWT(token);

//     // vérification des rôles autorisés
//     if (!roles.includes(role)) {
//       throw new ForbiddenError(`Permission denied for role: ${role}`);
//     }

//     (req as any).userId = userId;
//     (req as any).userRole = role;

//     next();
//   };
// }

// function extractAccessToken(req: Request): string {
//   if (typeof req.cookies?.accessToken === "string") {
//     return req.cookies.accessToken;
//   }

//   if (typeof req.headers?.authorization === "string") {
//     return req.headers.authorization.split(" ")[1];
//   }

//   throw new UnauthorizedError("Access Token not provided");
// }

// function verifyAndDecodeJWT(accessToken: string): MyJWTPayload {
//   try {
//     return jwt.verify(accessToken, config.server.jwtSecret) as MyJWTPayload;
//   } catch (error) {
//     throw new UnauthorizedError("Invalid or expired access token");
//   }
// }
