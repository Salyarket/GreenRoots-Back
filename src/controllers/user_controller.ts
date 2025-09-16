import { PrismaClient } from "@prisma/client";
import AuthController from "./auth_controller.js";

const prisma = new PrismaClient();

class UserController extends AuthController {
  constructor() {
    super(prisma, "users");
  }
}

export default new UserController();
