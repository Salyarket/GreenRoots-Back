import { Router } from "express";
import authRouter from "./auth.router.js";
import locationRouter from "./location.router.js";
import userTypesRouter from "./user-type.router.js";
import orderRouter from "./orders.router.js";
import userRouter from "./user.router.js";
import loggerRouter from "./logger.router.js";

// import { router as productsRouter } from "./products.router.js";
import productRouter from "./product.router.js";

export const router = Router();

router.get("/", (req, res) => {
  res.redirect("/api-docs");
});

router.use("/products", productRouter);
// router.use("/products", productRouter);

router.use("/auth", authRouter);

router.use("/locations", locationRouter); //Oumaïma

router.use("/user-types", userTypesRouter); //Adrien

router.use("/orders", orderRouter); //Tarig

router.use("/users", userRouter);

router.use("/logs", loggerRouter); // Saliha
