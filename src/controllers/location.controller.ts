import { PrismaClient } from "@prisma/client";
import BaseController from "./base.controller.js";
import { z } from "zod";

const prisma = new PrismaClient();

const locationsSchema = z.object({
  name: z.string().min(1).max(255),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const locationProductSchema = z.object({
  product_id: z.number().int().positive(),
});

class LocationController extends BaseController {
  constructor() {
    super(prisma.location, "location", locationsSchema, {
      productLocations: {
        include: {
          product: true,
        },
      },
    });
  }
  
  // Ajout d’une liaison localisation à un produit
  addProduct = this.createRelation("productLocations", ["product_id"], locationProductSchema);
  // Modification d’une liaison localisation à un produit
  updateProduct = this.updateRelation("productLocations", "product_id_location_id", locationProductSchema);
  // Modification d’une liaison localisation produit
  removeProduct = this.removeRelation("productLocations", "product_id_location_id");
}

export default new LocationController();
