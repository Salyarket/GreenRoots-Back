import { Router } from "express";
import authRouter from "./auth.router.js";
import locationRouter from "./location.router.js";
import userTypesRouter from "./user-type.router.js";
import orderRouter from "./orders.router.js";

// import { router as productsRouter } from "./products.router.js";
import productRouter  from "./product.router.js";

export const router = Router();

router.get("/", (req, res) => {
  res.redirect("/api-docs");
});

router.use("/products", productRouter);
// router.use("/products", productRouter);

router.use("/auth", authRouter);

router.use("/locations", locationRouter);

router.use("/user-types", userTypesRouter);

router.use("/orders", orderRouter);
