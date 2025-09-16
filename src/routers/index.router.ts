import { Router } from "express";

import { router as productsRouter } from "./products.router.js";

export const router = Router();

router.use(productsRouter);

router.use("/", (req, res) => {
  res.send("Hello World");
});
