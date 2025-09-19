import dotenv from "dotenv";
dotenv.config();

import express from "express"; // Pour installer les types d'Express : npm i --save-dev @types/express -w api
import { router as apiRouter } from "./routers/index.router.js";
import { setupSwagger } from "./swagger/swagger_config.js";

import cors from "cors";


if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET manquant dans .env");
}
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL manquant dans .env");
}

// // Autoriser les requêtes cross-origin
app.use(cors({ origin: process.env.ALLOWED_DOMAINS || "*" }));
// // Cookie parser
// app.use(cookieParser());

// // Body parser pour récupérer les body "application/json" dans req.body
app.use(express.json());

// Créer une app Express
export const app = express();

setupSwagger(app);
app.use("/", apiRouter);