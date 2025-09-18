import { Router } from "express";
import locationRouter from "./location.router.js";

export const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the GREENROOTS API",
  });
});

router.use("/locations", locationRouter);
