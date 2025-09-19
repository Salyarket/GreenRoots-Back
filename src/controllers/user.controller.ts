import bcrypt from "bcrypt";
import { createUserSchema, updateUserSchema } from "../schema/user.schema.js";
import { NotFoundError } from "../lib/errors.js";
import { prisma } from "../models/index.js";
import { Request, Response } from "express";

// GET all users
export async function getAllUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany({
    include: {
      userType: true,
      orders: true,
      logs: true,
    },
  });
  res.json(users);
}

// GET one user
export async function getOneUser(req: Request, res: Response) {
  const user_id = parseInt(req.params.id);

  const user = await prisma.user.findUnique({
    where: { id: user_id },
    include: {
      userType: true,
      orders: { include: { items: { include: { product: true } } } },
      logs: true,
    },
  });
  if (!user) throw new NotFoundError(`User not found: ${user_id}`);
  res.json(user);
}

// CREATE an user
export async function createUser(req: Request, res: Response) {
  const data = await createUserSchema.parseAsync(req.body);

  // Hash password before backup
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const createdUser = await prisma.user.create({
    data: {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      entity_name: data.entity_name,
      userType: { connect: { id: data.userTypeId }}
    },
    include: { userType: true }
  });
  // suppression du mdp avant retour
  delete (createdUser as any).password;
  res.status(201).json(createdUser);
}

// UPDATE an user
export async function updateUser(req: Request, res: Response) {
  const user_id = parseInt(req.params.id);
  const data = await updateUserSchema.parseAsync(req.body);

  const foundUser = await prisma.user.findUnique({ where: { id: user_id } });
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

  const updatedUser = await prisma.user.update({
    where: { id: user_id },
    data: updateData,
    include: { userType: true }
  });
  res.json(updatedUser);
}

// DELETE an user
export async function deleteUser(req: Request, res: Response) {
  const user_id = parseInt(req.params.id);
  const user = await prisma.user.findUnique({ where: { id: user_id } });
  if (!user) throw new NotFoundError(`User not found: ${user_id}`);
  await prisma.user.delete({ where: { id: user_id } });
  res.status(204).end();
}

// GET mon profil 
export async function getMe(req: Request, res: Response) {
  const userId = (req as any).userId; // injecté par le middleware JWT

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { userType: true, orders: true, logs: true },
  });

  if (!user) throw new NotFoundError(`User not found: ${userId}`);

  // Supprime le mot de passe avant retour
  const userSafe: any = user;
  delete userSafe.password;

  res.json(userSafe);
}

// PATCH mon profil
export async function updateMe(req: Request, res: Response) {
  const userId = (req as any).userId;
  const role = (req as any).role;

  const data = await updateUserSchema.parseAsync(req.body);

  const foundUser = await prisma.user.findUnique({ where: { id: userId } });
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

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    include: { userType: true },
  });

  // Supprime le mot de passe avant retour
  const userSafe: any = updatedUser;
  delete userSafe.password;

  res.json(userSafe);
}
