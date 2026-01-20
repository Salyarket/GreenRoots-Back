import { Router } from "express";
import authRouter from "./auth.router.js";
import locationRouter from "./location.router.js";
import userTypesRouter from "./user-type.router.js";
import orderRouter from "./orders.router.js";
import userRouter from "./user.router.js";
import loggerRouter from "./logger.router.js";
import productRouter from "./product.router.js";
import paymentRouter from "./payments.router.js";


export const router = Router();

router.get("/", (req, res) => {
  res.redirect("/api-docs");
});

// Route de test pour le front
router.get("/api/hello", (req, res) => {
  res.json({ message: "Hello depuis Express 🚀" });
});

router.use("/products", productRouter);

router.use("/auth", authRouter);

router.use("/locations", locationRouter);

router.use("/user-types", userTypesRouter);

router.use("/orders", orderRouter);

router.use("/users", userRouter);

router.use("/logs", loggerRouter);

router.use("/payments", paymentRouter);

