import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, response, Response } from "express";
import bcrypt from "bcrypt";
import { ConflictError, UnauthorizedError } from "../lib/errors.js";
import { loginSchema, registerSchema } from "../schemas/user.schema.js";
import { config } from "../../config.js";
import { generateAuthenticationTokens } from "../lib/token.js";

export default class AuthController {
  model: PrismaClient["user"]; // modèle prisma user
  modelName: string;
  refreshToken: PrismaClient["refreshToken"];

  constructor(prisma: PrismaClient, modelName: string) {
    this.model = prisma.user; // recupere le model user
    this.modelName = modelName;
    this.refreshToken = prisma.refreshToken;
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

      // on génère les tokens d'auth
      const { accessToken, refreshToken } = generateAuthenticationTokens(user);

      // si besoin on supprime ce qu'il y a déjà en bdd
      await this.replaceRefreshTokenInDB(
        user.id,
        refreshToken.token,
        refreshToken.expiresInMS
      );

      // utilisation des fonctions set pour mettre les tokens dans les cookies de la réponse http
      await this.setAccessTokenCookie(
        res,
        accessToken.token,
        accessToken.expiresInMS
      );
      await this.setRefreshTokenCookie(
        res,
        refreshToken.token,
        refreshToken.expiresInMS
      );

      return res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
        },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };

  // 3. FUNCTION REFRESH ACCESS TOKEN

  // function replace refresh token in DB
  replaceRefreshTokenInDB = async (
    userId: number,
    token: string,
    expiresInMs: number
  ) => {
    await this.refreshToken.deleteMany({ where: { user_id: userId } });
    await this.refreshToken.create({
      data: {
        token: token,
        user_id: userId,
        created_at: new Date(),
        expired_at: new Date(new Date().valueOf() + expiresInMs),
      },
    });
  };

  // logique pour stocker access token dans cookie
  setAccessTokenCookie = async (
    res: Response,
    token: string,
    expiresInMs: number
  ) => {
    res.cookie("accessToken", token, {
      httpOnly: true,
      maxAge: expiresInMs,
      secure: config.server.secure,
    });
  };

  // logique pour stocker refresh token dans cookie
  setRefreshTokenCookie = async (
    res: Response,
    token: string,
    expiresInMs: number
  ) => {
    res.cookie("refreshToken", token, {
      httpOnly: true,
      maxAge: expiresInMs,
      secure: config.server.secure,
      path: "api/auth/refresh",
    });
  };

  // function refresh access token : prolonger la session d’un utilisateur déjà connecté sans redemander le mot de passe
  refreshAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // récupérer le refresh token
    const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!rawToken) {
      throw new UnauthorizedError("Refresh token not provided");
    }

    // vérifier que le token existe en base
    const existingRefreshToken = await this.refreshToken.findFirst({
      where: { token: rawToken },
      include: { user: true },
    });
    if (!existingRefreshToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    // vérifier la validité du token
    if (existingRefreshToken.expired_at < new Date()) {
      await this.refreshToken.delete({
        where: { id: existingRefreshToken.id },
      });
      throw new UnauthorizedError("Expired refresh token");
    }

    // générer les tokens d'authentification
    const { accessToken, refreshToken } = generateAuthenticationTokens(
      existingRefreshToken.user
    );

    // remplacer l'ancien refresh token
    await this.replaceRefreshTokenInDB(
      existingRefreshToken.user.id,
      refreshToken.token,
      refreshToken.expiresInMS
    );

    // mettre les tokens en cookie
    this.setAccessTokenCookie(res, accessToken.token, accessToken.expiresInMS);
    this.setRefreshTokenCookie(
      res,
      refreshToken.token,
      refreshToken.expiresInMS
    );

    // répondre au client
    res.json({ accessToken, refreshToken });
  };
}
