import { Router } from "express";
import  productController from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

export const router = Router();


router.get("/", productController.getAll);
router.get("/pagination", productController.getProductsWithPagination);
router.get("/with_location/:id", productController.getOneProductWithLocations);
router.get("/:id", productController.getById);
router.post("/", upload.array("images", 3), productController.createProduct);
router.patch("/:id", upload.any(), productController.updateProduct);
router.delete("/:id",  productController.deleteProduct);

export default router;