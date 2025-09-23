import dotenv from "dotenv";
dotenv.config();

import express from "express"; // Pour installer les types d'Express : npm i --save-dev @types/express -w api
import { router as apiRouter } from "./routers/index.router.js";
import { setupSwagger } from "./swagger/swagger-config.js";
import { globalErrorHandler } from "./middlewares/global-error-handler.js";

import cors from "cors";

// Créer une app Express
export const app = express();

//! DEVELOPPEMENT SUPPRIMER PLUS TARD
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET manquant dans .env");
}
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL manquant dans .env");
}

// Autoriser les requêtes cross-origin
//! sécurité au moment de connecter le back avec le front
app.use(cors({ origin: process.env.ALLOWED_DOMAINS || "*" }));

// Cookie parser
// app.use(cookieParser());

app.use(express.json());

setupSwagger(app);

app.use("/", apiRouter);
app.use(globalErrorHandler); // Global error middleware
