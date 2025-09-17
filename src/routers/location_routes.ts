import { Router } from "express";
import locationController from "../controllers/location_controller.js";

const router = Router();

router.get("/", locationController.getAll);

router.get("/:id", locationController.getById);

router.post("/", locationController.create);

router.put("/:id", locationController.update);

// router.delete("/:id", locationController.deleteById);

export default router;
