import { Router } from "express";
import locationRouter from "./location.router.js";

export const router = Router();

router.use("/location", locationRouter);

router.use("/", (req, res) => {
  res.send("Hello World");
});
