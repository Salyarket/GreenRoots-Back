import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
//import { Role } from "../models/generated/client"; ===> quand client branché


const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// type attendu dans le jwt
interface MyJWTPayload {
  userId: number;
  role: string; //role: Role ==> quand client branché
}

// vérification des rôles
export function checkRoles(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token manquant" });
    }

    const token = authHeader.split(" ")[1]; // "Bearer eyJhbGciOiblabla..."

    try {
      // vérification et décode le jwt
      const decoded = jwt.verify(token, JWT_SECRET) as MyJWTPayload;

      // vérification du rôle
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Accès interdit" });
      }

      // ajout des infos dans req 
      (req as any).userId = decoded.userId;
      (req as any).userRole = decoded.role;

      next(); 
    } catch (err) {
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }
  };
}
