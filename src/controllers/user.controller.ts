import bcrypt from "bcrypt";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema.js";
import { NotFoundError } from "../lib/errors.js";
import { prisma } from "../models/index.js";
import { NextFunction, Request, Response } from "express";
import BaseController from "./base.controller.js";

const userRelations = {
  userType: true,
  orders: { include: { items: { include: { product: true } } } },
  logs: true,
};

class UserController extends BaseController {
  constructor() {
    super(prisma.user, "user", createUserSchema, userRelations);
  }

  // CREATE an user
  //! TODO : pas de create user dans le cahier des charges
  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await createUserSchema.parseAsync(req.body);

      // Hash password before backup
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const createdUser = await this.model.create({
        data: {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: hashedPassword,
          role: data.role,
          entity_name: data.entity_name,
          userType: { connect: { id: data.userTypeId } },
        },
        include: this.relations,
      });
      // suppression du mdp avant retour
      delete (createdUser as any).password;
      res.status(201).json(createdUser);
    } catch (error) {
      next(error);
    }
  };

  // UPDATE an user
  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_id = parseInt(req.params.id);
      const data = await updateUserSchema.parseAsync(req.body);

      const foundUser = await this.model.findUnique({
        where: { id: user_id },
      });
      if (!foundUser) throw new NotFoundError(`User not found: ${user_id}`);

      // Préparation des données à mettre à jour
      const updateData: any = { ...data, updated_at: new Date() };

      // Si password fourni on le hash avant maj
      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
      }

      // Si userTypeId fourni on le transforme en relation Prisma
      if (data.userTypeId) {
        updateData.userType = { connect: { id: data.userTypeId } };
        delete updateData.userTypeId;
      }

      const updatedUser = await this.model.update({
        where: { id: user_id },
        data: updateData,
        include: this.relations,
      });
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  // GET mon profil
  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId; // injecté par le middleware JWT

      const user = await this.model.findUnique({
        where: { id: userId },
        include: this.relations,
      });

      if (!user) throw new NotFoundError(`User not found: ${userId}`);

      // Supprime le mot de passe avant retour
      const userSafe: any = user;
      delete userSafe.password;

      res.json(userSafe);
    } catch (error) {
      next(error);
    }
  };

  // PATCH mon profil
  updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;
      const role = (req as any).role;

      const data = await updateUserSchema.parseAsync(req.body);

      const foundUser = await this.model.findUnique({ where: { id: userId } });
      if (!foundUser) throw new NotFoundError(`User not found: ${userId}`);

      const updateData: any = { ...data, updated_at: new Date() };

      // Hashage si password fourni
      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
      }

      // Ça bloque les non-admins sur les champs sensibles
      if (role !== "admin") {
        delete updateData.role;
        delete updateData.userTypeId;
      } else if (data.userTypeId) {
        updateData.user_type_id = data.userTypeId;
        delete updateData.userTypeId;
      }

      const updatedUser = await this.model.update({
        where: { id: userId },
        data: updateData,
        include: this.relations,
      });

      // Supprime le mot de passe avant retour
      const userSafe: any = updatedUser;
      delete userSafe.password;

      res.json(userSafe);
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
