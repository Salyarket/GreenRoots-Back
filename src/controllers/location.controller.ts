import { PrismaClient } from "@prisma/client";
import BaseController from "./base.controller.js";
import {
  locationProductSchema,
  locationsSchema,
} from "../schemas/location.schema.js";

const prisma = new PrismaClient();

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
  addProduct = this.createRelation(
    "productLocations",
    ["product_id"],
    locationProductSchema
  );
  // Modification d’une liaison localisation à un produit
  updateProduct = this.updateRelation(
    "productLocations",
    "product_id_location_id",
    locationProductSchema
  );
  // Modification d’une liaison localisation produit
  removeProduct = this.removeRelation(
    "productLocations",
    "product_id_location_id"
  );
}

export default new LocationController();
