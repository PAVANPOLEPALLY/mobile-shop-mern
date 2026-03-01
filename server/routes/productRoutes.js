import express from "express";
import { body } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  uploadProductImages
} from "../controllers/productController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const productValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("category")
    .isIn(["mobile", "accessory"])
    .withMessage("Category must be mobile or accessory"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be positive"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be non-negative")
];

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  protectAdmin,
  upload.array("images", 6),
  productValidation,
  validateRequest,
  createProduct
);
router.put("/:id", protectAdmin, upload.array("images", 6), updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);
router.post("/upload", protectAdmin, upload.array("images", 6), uploadProductImages);

export default router;
