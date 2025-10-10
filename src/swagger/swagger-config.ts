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
        url: "http://localhost:4000",
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
        Product_create: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Érable du Canada",
            },
            price: {
              type: "integer",
              example: 80,
            },
            description: {
              type: "string",
              example: "Arbre aux feuilles rouges à l’automne",
            },
            images: {
              type: "array",
              items: {
                type: "string",
                example: "erable.jpg",
                format: "binary",
              },
              description: "Images du produit (Jusqu'à 3 images possibles)",
            },
            replace_images: {
              type: "boolean",
              example: true,
              description:
                "la valeur true remplace les images et false en ajoute(s)",
            },
            available: {
              type: "boolean",
              example: true,
            },
            stock: {
              type: "integer",
              example: 40,
            },
            scientific_name: {
              type: "string",
              example: "Acer saccharum",
            },
            carbon: {
              type: "integer",
              example: 25,
            },
          },
          required: ["name", "price", "description", "available", "stock"],
        },
        Product_patch: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Érable du Canada",
            },
            price: {
              type: "integer",
              example: 80,
            },
            description: {
              type: "string",
              example: "Arbre aux feuilles rouges à l’automne",
            },
            images: {
              type: "array",
              items: {
                type: "string",
                example: "erable.jpg",
                format: "binary",
              },
              description: "Images du produit (Jusqu'à 3 images possibles)",
            },
            replace_images: {
              type: "boolean",
              example: true,
              description:
                "la valeur true remplace les images et false en ajoute(s)",
            },
            available: {
              type: "boolean",
              example: true,
            },
            stock: {
              type: "integer",
              example: 40,
            },
            scientific_name: {
              type: "string",
              example: "Acer saccharum",
            },
            carbon: {
              type: "integer",
              example: 25,
            },
          },
        },
        UserType: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            code: {
              type: "string",
              example: "PRO",
              description: "Code unique du type d'utilisateur",
            },
            label: {
              type: "string",
              example: "Professionnel",
              description: "Libellé du type d'utilisateur",
            },
            tva_rate: {
              type: "number",
              format: "float",
              example: 20.0,
              description: "Taux de TVA appliqué",
            },
          },
          required: ["code", "label", "tva_rate"],
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
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
