import { PrismaClient } from "@prisma/client";
import BaseController from "./BaseController.js";

const prisma = new PrismaClient();

class LocationController extends BaseController {
  constructor() {
    super(prisma.location, "locations");
  }
}

export default new LocationController();
