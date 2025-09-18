import { Router } from "express";
import authRouter from "./auth_routes.js";

export const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the GREENROOTS API",
  });
});

router.use("/auth", authRouter);
