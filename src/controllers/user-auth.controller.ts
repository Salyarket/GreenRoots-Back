import { PrismaClient } from "@prisma/client";
import AuthController from "./auth.controller.js";

const prisma = new PrismaClient();

class UserAuthController extends AuthController {
  constructor() {
    super(prisma, "users");
  }
}

export default new UserAuthController();
