import { Router } from "express";
import authRouter from "./auth.router.js";
import locationRouter from "./location.router.js";
import userTypesRouter from "./user-type.router.js";
import { router as ordersRouter } from "./orders.router.js";


export const router = Router();

router.get("/", ordersRouter, (req, res) => {
  res.redirect("/api-docs");
});

router.use("/auth", authRouter);

router.use("/locations", locationRouter);

router.use("/user-types", userTypesRouter);
