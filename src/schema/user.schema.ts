import { z } from "zod";

export const createUserSchema = z.object({
    firstname: z.string().min(1).max(255),
    lastname: z.string().min(1).max(255),
    email: z.string().email().max(320),
    password:z.string().min(6).max(255),
    role: z.enum(["member", "admin"]).default("member"),
    entity_name: z.string().max(255).optional(),
    userTypeId: z.number().int().positive(), // lien avec user_type
    });
    
    export const updateUserSchema = z.object({
        firstname: z.string().min(1).max(255).optional(),
        lastname: z.string().min(1).max(255).optional(),
        email: z.string().email().max(320).optional(),
        password:z.string().min(6).max(255).optional(),
        role: z.enum(["member", "admin"]).optional(),
        entity_name: z.string().max(255).optional(),
        userTypeId: z.number().int().positive().optional(),
        });