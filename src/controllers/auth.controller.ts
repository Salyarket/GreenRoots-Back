import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { ConflictError, UnauthorizedError } from "../lib/errors.js";
import { loginSchema, registerSchema } from "../schemas/user.schema.js";
import { config } from "../../config.js";
import { generateAuthenticationTokens } from "../lib/token.js";

export default class AuthController {
  model: PrismaClient["user"]; // modèle prisma User
  modelName: string;
  refreshToken: PrismaClient["refreshToken"];

  constructor(prisma: PrismaClient, modelName: string) {
    this.model = prisma.user; // récupère le modèle user
    this.modelName = modelName;
    this.refreshToken = prisma.refreshToken;
  }

  // Fonction REGISTER
  register = async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = registerSchema.parse(req.body);

    const { email, password } = validatedData as {
      email: string;
      password: string;
    };
    try {
      // hâcher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // créer un nouveau user
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
      return res.json({ message: "Nouveau membre créé" });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictError("Problème d'unicité");
        }
      }
      next(error);
    }
  };

  // Fonction LOGIN
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
      // si non trouvé => erreur
      if (!user) {
        throw new UnauthorizedError("Information invalide");
      }
      // si trouvé => comparer le mdp avec celui en bdd
      else {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw new UnauthorizedError("Information invalide");
        }
      }
      // 1- On vérifie que le secret JWT existe
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error("JWT_SECRET n'est pas défini");

      // 2- On génère les tokens : access + refresh
      const { accessToken, refreshToken } = generateAuthenticationTokens(user);

      // 3- On remplace (ou on crée) le refresh token en bdd
      await this.replaceRefreshTokenInDB(
        user.id,
        refreshToken.token,
        refreshToken.expiresInMS
      );
      // 4- On stocke les tokens dans des cookies httpOnly
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
        message: "Connexion réussie",
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

  // Fonction LOGOUT
  logoutUser = async (_: Request, res: Response) => {
    const sameSite = config.server.secure ? "none" : "lax";
    const domain = config.server.cookieDomain || undefined;
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: config.server.secure,
      sameSite,
      domain,
      path: "/",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: config.server.secure,
      sameSite,
      domain,
      path: "/auth/refresh",
    });
    res.status(204).json({ status: 204, message: "Déconnexion réussie" });
  };

  // Fonction REFRESH ACCESS TOKEN
  // Fonction "replace refresh token dans la bdd"
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

  // logique pour stocker access token dans Cookie
  setAccessTokenCookie = async (
    res: Response,
    token: string,
    expiresInMs: number
  ) => {
    const sameSite = config.server.secure ? "none" : "lax";
    const domain = config.server.cookieDomain || undefined;
    res.cookie("accessToken", token, {
      httpOnly: true,
      maxAge: expiresInMs,
      secure: config.server.secure,
      sameSite,
      domain,
      path: "/",
    });
  };

  // logique pour stocker refresh token dans Cookie
  setRefreshTokenCookie = async (
    res: Response,
    token: string,
    expiresInMs: number
  ) => {
    const sameSite = config.server.secure ? "none" : "lax";
    const domain = config.server.cookieDomain || undefined;
    res.cookie("refreshToken", token, {
      httpOnly: true,
      maxAge: expiresInMs,
      secure: config.server.secure,
      sameSite,
      domain,
      path: "/auth/refresh",
    });
  };

  // Fonction "refresh access token" : prolonger la session d’un utilisateur déjà connecté sans demander à nouveau le mdp
  refreshAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // récupérer le refresh token
    const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!rawToken) {
      throw new UnauthorizedError("Jeton d'authentification n'est pas fourni");
    }

    // vérifier que le token existe en base
    const existingRefreshToken = await this.refreshToken.findFirst({
      where: { token: rawToken },
      include: { user: true },
    });
    if (!existingRefreshToken) {
      throw new UnauthorizedError("Jeton d'authentification invalide");
    }

    // vérifier la validité du token
    if (existingRefreshToken.expired_at < new Date()) {
      await this.refreshToken.delete({
        where: { id: existingRefreshToken.id },
      });
      throw new UnauthorizedError("Jeton d'authentification expiré");
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
    await this.setAccessTokenCookie(res, accessToken.token, accessToken.expiresInMS);
    await this.setRefreshTokenCookie(
      res,
      refreshToken.token,
      refreshToken.expiresInMS
    );

    // répondre au client
    res.json({ accessToken, refreshToken });
  };
}
