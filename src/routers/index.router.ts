import { Router } from "express";
import authRouter from "./auth.router.js";
import locationRouter from "./location.router.js";

// import { router as productsRouter } from "./products.router.js";
import productRouter  from "./product.router.js";

export const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the GREENROOTS API",
  });
});

router.use("/products", productRouter);
// router.use("/products", productRouter);

router.use("/auth", authRouter);

router.use("/locations", locationRouter);
