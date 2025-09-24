import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ConflictError, UnauthorizedError } from "../lib/errors.js";
import { loginSchema, registerSchema } from "../schemas/user.schema.js";

export default class AuthController {
  model: PrismaClient["user"]; // modèle prisma user
  modelName: string;

  constructor(prisma: PrismaClient, modelName: string) {
    this.model = prisma.user; // recupere le model user
    this.modelName = modelName;
  }

  // 1. FUNCTION REGISTER
  register = async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = registerSchema.parse(req.body);

    const { email, password } = validatedData as {
      email: string;
      password: string;
    };
    try {
      // hasher pwd
      const hashedPassword = await bcrypt.hash(password, 10);
      // créer nouveau user
      const user = await this.model.create({
        data: {
          email: email,
          password: hashedPassword,
          role: "member",
          firstname: validatedData.firstname,
          lastname: validatedData.lastname,
          user_type_id: validatedData.user_type_id,
        },
      });
      return res.json({ message: "New member created" });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictError(`Uniqueness problem`);
        }
      }
      next(error);
    }
  };

  // 2. FUNCTION LOGIN
  login = async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = loginSchema.parse(req.body);

    const { email, password } = validatedData as {
      email: string;
      password: string;
    };

    try {
      // trouver user avec son email
      const user = await this.model.findFirst({
        where: { email },
      });
      // si non trouvé -> erreur
      if (!user) {
        throw new UnauthorizedError("Invalid information");
      }
      // si trouvé -> comparer le pwd avec celui en bdd
      else {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw new UnauthorizedError("Invalid information");
        }
      }
      //  si le pwd match générer un jwt
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error("JWT_SECRET is not defined");

      const jwtToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn: "24h" } // A REVOIR POUR PROD -> 1H
      );
      return res.json({ message: "Login successful", jwtToken });
    } catch (error) {
      next(error);
    }
  };
}
