import express from "express"; // Pour installer les types d'Express : npm i --save-dev @types/express -w api
import { router as apiRouter } from "./routers/index.router.js";

import { setupSwagger } from "./swagger/swagger_config.js";

import cors from "cors";

// Créer une app Express
export const app = express();

// // Autoriser les requêtes cross-origin
app.use(cors({ origin: process.env.ALLOWED_DOMAINS || "*" }));
// // Cookie parser
// app.use(cookieParser());

// // Body parser pour récupérer les body "application/json" dans req.body
app.use(express.json());

setupSwagger(app);

app.use("/", apiRouter);
