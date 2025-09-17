import { PrismaClient } from "@prisma/client";
import BaseController from "./BaseController.js";
import { z } from "zod";

const prisma = new PrismaClient();

const locationsSchema = z.object({
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

class LocationController extends BaseController {
  constructor() {
    super(prisma.location, "location", locationsSchema);
  }
}

export default new LocationController();
