import { Router } from "express";
import { router as ordersRouter } from "./orders.router.js";


export const router = Router();

router.use("/", ordersRouter, (req, res) => {
  res.send("Hello World");
});
