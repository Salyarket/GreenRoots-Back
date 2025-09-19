import { Router } from "express";
import authRouter from "./auth.router.js";
import locationRouter from "./location.router.js";

import { router as productsRouter } from "./products.router.js";

export const router = Router();

router.use(productsRouter);

router.use("/", (req, res) => {
  res.send("Hello World");
});
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the GREENROOTS API",
  });
});

router.use("/auth", authRouter);

router.use("/locations", locationRouter);
