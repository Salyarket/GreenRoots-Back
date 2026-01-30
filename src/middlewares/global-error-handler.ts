import { HttpClientError } from "../lib/errors.js";
import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import z from "zod";

// mdw signature 4 paramètres
export function globalErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(error);

  // Gestion des erreurs Zod = 400
  if (error instanceof z.ZodError) {
    res.status(400).json({
      status: 400,
      error: z.prettifyError(error),
    });
    return;
  }

  // Gestion des erreurs Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        // contrainte unique non respectée
        res.status(409).json({
          status: 409,
          error: `Conflit: valeur déjà utilisée pour ${error.meta?.target}`,
        });
        return;
      case "P2025":
        // élément non trouvé
        res.status(404).json({
          status: 404,
          error: "Ressource non trouvée",
        });
        return;
      default:
        res.status(400).json({
          status: 400,
          error: `Erreur Prisma (${error.code})`,
        });
        return;
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    // Mauvais arguments envoyés au client
    res.status(400).json({
      status: 400,
      error: "Erreur de validation Prisma",
    });
    return;
  }

  // Gestion des erreurs client
  if (error instanceof HttpClientError) {
    res.status(error.status).json({
      status: error.status,
      error: error.message,
    });
    return;
  }

  // Gestion des erreurs serveur - 500
  res.status(500).json({
    status: 500,
    error: "Erreur interne du serveur",
  });
}
