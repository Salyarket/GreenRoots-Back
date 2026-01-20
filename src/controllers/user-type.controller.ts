import { PrismaClient } from "@prisma/client";
import BaseController from "./base.controller.js";
import { userTypeSchema } from "../schemas/user-types.schema.js";

const prisma = new PrismaClient();

class UserTypeController extends BaseController {
  constructor() {
    super(prisma.userType, "user-type", userTypeSchema);
  }
}

export default new UserTypeController();
