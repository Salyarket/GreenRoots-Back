import { Router } from "express";
import authRouter from "./auth.router.js";
import locationRouter from "./location.router.js";

export const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the GREENROOTS API",
  });
});

router.use("/auth", authRouter);

router.use("/locations", locationRouter);
