import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ZodType } from "zod";

export default class AuthController {
  model: PrismaClient["user"]; // modèle prisma user
  modelName: string;
  schema?: ZodType;

  constructor(prisma: PrismaClient, modelName: string, schema?: ZodType) {
    this.model = prisma.user; // recupere le model user
    this.modelName = modelName;
    this.schema = schema;
  }

  // 1. FUNCTION REGISTER
  register = async (req: Request, res: Response) => {
    const validatedData = this.schema ? this.schema.parse(req.body) : req.body;

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
      // vérifier unicité des données
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // code P2002 : unique constraint failed
        if (error.code === "P2002") {
          return res.json({ error: "Uniqueness problem" });
        }
      }
      console.error("Registration error : ", error);
      return res.json({
        error: "Registration failed. Please try again later.",
      });
    }
  };

  // 2. FUNCTION LOGIN
  login = async (req: Request, res: Response) => {
    const validatedData = this.schema ? this.schema.parse(req.body) : req.body;

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
        return res.json({ error: "Invalid information" });
      }
      // si trouvé -> comparer le pwd avec celui en bdd
      else {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.json({ error: "Invalid information" });
        }
      }
      //  si le pwd match générer un jwt
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error("JWT_SECRET is not defined");

      const jwtToken = jwt.sign(
        { userId: user.id, email: user.email },
        secret,
        { expiresIn: "2h" }
      );
      return res.json({ message: "Login successful" });
    } catch (error) {
      console.log(error);
      return res.json({
        error:
          "The server encountred an internal error. Please try again later",
      });
    }
  };
}
