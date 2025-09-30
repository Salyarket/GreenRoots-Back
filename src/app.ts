import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import { router as apiRouter } from "./routers/index.router.js";
import { setupSwagger } from "./swagger/swagger-config.js";
import { globalErrorHandler } from "./middlewares/global-error-handler.js";
import cookieParser from "cookie-parser"; // pour gérer les cookies dans les requêtes HTTP en les analysant et en les rendant accessibles via req.cookies

import path from "path";
import { fileURLToPath } from "url";
import { config } from "../config.js";

// Recréer __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créer une app Express
export const app = express();

// Autoriser les requêtes cross-origin A REVOIR PRODC
// ALLOWED_ORIGINS=*
app.use(
  cors({
    origin: config.server.allowedOrigins, // ton front
    credentials: true,
  })
);

// Middleware pour parser les cookies (attention : avant tes routes)
app.use(cookieParser());

// Middleware pour servir les fichiers du dossier uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Middleware JSON & URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
setupSwagger(app);

// Routes
app.use("/", apiRouter);

// Global error middleware > toujours être en dernier sauf après un 404 handler !
app.use(globalErrorHandler);
