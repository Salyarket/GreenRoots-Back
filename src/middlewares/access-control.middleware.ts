import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// type attendu dans le jwt
interface MyJWTPayload {
  userId: number;
  role: string;
}

// vérif' des rôles
export function checkRoles(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // on utilise la fonction utilitaire, on met authHeader pour éviter les conflits
      const token = extractAccessToken(req);

      // vérif' et décode le jwt
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as MyJWTPayload;

      // vérif du rôle
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Accès interdit" });
      }

      // stocker les infos dans req
      (req as any).userId = decoded.userId;
      (req as any).userRole = decoded.role;

      next();
    } catch {
      return res.status(401).json({ error: "Jeton invalide ou expiré" });
    }
  };
}

function extractAccessToken(req: Request): string {
  if (typeof req.cookies?.accessToken === "string") {
    return req.cookies.accessToken;
  }
  if (typeof req.headers?.authorization === "string") {
    return req.headers.authorization.split(" ")[1]; // "Bearer <token>"
  }
  throw new Error("Token non fourni");
}
