import { Router } from "express";

export const router = Router();

router.use("/", (req, res) => {
  res.send("Hello World");
});
