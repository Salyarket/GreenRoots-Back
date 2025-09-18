import { Router } from "express";
import authRouter from "./auth_routes.js";

export const router = Router();

router.get("/", (req, res) => {
  res.redirect("/api-docs");
});

router.use("/auth", authRouter);
