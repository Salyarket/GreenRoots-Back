import { Router } from "express";
import { checkRoles } from "../middlewares/access-control.middleware.js";
import { 
    getAllOrders, 
    getOneOrder, 
    createOrder, 
    updateOrder, 
    deleteOrder 
  } from "../controllers/order.controller.js";

export const router = Router();

// Récup toutes les commandes (admin only, back-office)
router.get("/orders", checkRoles(["admin"]), getAllOrders);

// voir commande complète avec user + type + items
router.get("/orders/:id", checkRoles(["admin"]), getOneOrder);

// voir commandes d’un utilisateur précis (admin only)
router.get("/users/:id/orders", checkRoles(["admin"]), (req, res) => {
  const userId = req.params.id;
  res.json({ message: `Commandes de l’utilisateur ${userId}` });
});

// voir commandes type historique personnel (member only)
router.get("/me/orders", checkRoles(["member"]), (req, res) => {
  res.json({
    message: `Commandes de l’utilisateur connecté ${(req as any).userId}`,
  });
});

// créer une commande depuis le panier (member only)
router.post("/orders", checkRoles(["member"]), createOrder);

// modifier le statut (admin only : pending > paid/cancelled)
router.patch("/orders/:id", checkRoles(["admin"]), updateOrder);

// Supprimer une commande (admin only)
router.delete("/orders/:id", checkRoles(["admin"]), deleteOrder);

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

