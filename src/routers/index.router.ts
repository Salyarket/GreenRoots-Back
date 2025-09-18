import { Router } from "express";
import authRouter from "./auth_routes.js";

export const router = Router();

router.use("/auth", authRouter);

router.use("/", (req, res) => {
  res.send("Welcome on the GreenRoots API");
});
