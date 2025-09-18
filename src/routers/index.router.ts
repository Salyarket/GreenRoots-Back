import { Router } from "express";
import locationRouter from "./location.router.js";

export const router = Router();

router.use("/locations", locationRouter);

router.use("/", (req, res) => {
  res.send("Welcome on the GreenRoots API");
});
