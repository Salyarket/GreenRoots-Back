import { Router } from "express";
import  productController from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { checkRoles } from "../middlewares/access-control.middleware.js";

export const router = Router();


router.get("/", productController.getAll);
router.get("/pagination", productController.getAllWithPagination);
router.get("/with_location/:id", productController.getOneProductWithLocations);
router.get("/:id", productController.getById);
router.post("/", checkRoles(["admin"]), upload.array("images", 3), productController.createProduct);
router.patch("/:id", checkRoles(["admin"]), upload.any(), productController.updateProduct);
router.delete("/:id", checkRoles(["admin"]),  productController.deleteProduct);

export default router;