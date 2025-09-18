import { Router } from "express";

export const router = Router();

router.use("/", (req, res) => {
  res.send("Welcome on the GreenRoots API");
});
