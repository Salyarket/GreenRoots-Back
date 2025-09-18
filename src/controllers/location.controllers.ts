import { PrismaClient } from "@prisma/client";
import BaseController from "./base.controllers.js";
import { z } from "zod";

const prisma = new PrismaClient();

const locationsSchema = z.object({
  name: z.string().min(1).max(255),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

class LocationController extends BaseController {
  constructor() {
    super(prisma.location, "location", locationsSchema);
  }
}

export default new LocationController();
