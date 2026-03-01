import express from "express";
import { body } from "express-validator";
import {
  createProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductById,
  getProducts,
  toggleProductFeatured,
  updateProduct,
  uploadProductImages
} from "../controllers/productController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const discountValidation = [
  body("discount")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0, max: 90 })
    .withMessage("Discount must be between 0 and 90")
];

const createProductValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("category")
    .isIn(["mobile", "accessory"])
    .withMessage("Category must be mobile or accessory"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be positive"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be non-negative"),
  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be boolean"),
  body("featuredOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("featuredOrder must be non-negative"),
  ...discountValidation
];

const updateProductValidation = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("category")
    .optional()
    .isIn(["mobile", "accessory"])
    .withMessage("Category must be mobile or accessory"),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be positive"),
  body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be non-negative"),
  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be boolean"),
  body("featuredOrder")
    .optional()
    .isInt({ min: 0 })
    .withMessage("featuredOrder must be non-negative"),
  ...discountValidation
];

router.get("/", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  protectAdmin,
  upload.array("images", 6),
  createProductValidation,
  validateRequest,
  createProduct
);
router.put(
  "/:id",
  protectAdmin,
  upload.array("images", 6),
  updateProductValidation,
  validateRequest,
  updateProduct
);
router.patch("/:id/featured", protectAdmin, toggleProductFeatured);
router.delete("/:id", protectAdmin, deleteProduct);
router.post("/upload", protectAdmin, upload.array("images", 6), uploadProductImages);

export default router;
