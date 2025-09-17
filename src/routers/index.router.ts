import { Router } from "express";

export const router = Router();

router.get("/", (req, res) => {
  res.send("Hello");
});

router.get("/toto", (req, res) => {
  res.json({ data: "toto" });
});
router.use("/test", (req, res) => {
  res.json({ data: "test" });
});
