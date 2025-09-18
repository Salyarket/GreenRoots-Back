import { Router } from "express";
import authRouter from "./auth.router.js";

export const router = Router();

router.get("/", (req, res) => {
  res.redirect("/api-docs");
});

router.use("/auth", authRouter);
