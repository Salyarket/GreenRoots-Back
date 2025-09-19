import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"; // fournit une page web interactive

import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GreenRoots API",
      version: "1.0.0",
      description: "API documentation with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveur local",
      },
    ],
    components: {
      schemas: {
        Location: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            name: {
              type: "string",
              example: "Amazonie",
            },
            latitude: {
              type: "number",
              format: "float",
              example: -3.465305,
            },
            longitude: {
              type: "number",
              format: "float",
              example: -62.215881,
            },
          },
          required: ["name", "latitude", "longitude"],
        },
      },
    },
  },
  apis: ["./src/routers/*.ts"], // chemin vers fichiers de routes
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
