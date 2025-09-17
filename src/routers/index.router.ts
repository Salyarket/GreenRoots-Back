import { Router } from "express";
import locationRouter from "./location_routes.js";

export const router = Router();

router.use("/location", locationRouter);

router.use("/", (req, res) => {
  res.send("Hello World");
});
