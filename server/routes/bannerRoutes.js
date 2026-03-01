import express from "express";
import { body, param, query } from "express-validator";
import {
  createBanner,
  deleteBanner,
  getActiveBanners,
  getAllBannersAdmin,
  toggleBannerStatus,
  updateBanner,
  updateBannerOrder
} from "../controllers/bannerController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.get(
  "/",
  [query("type").optional().isIn(["hero", "offer"]).withMessage("Invalid banner type")],
  validateRequest,
  getActiveBanners
);

router.get("/admin/all", protectAdmin, getAllBannersAdmin);

router.post(
  "/",
  protectAdmin,
  upload.single("image"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("type").isIn(["hero", "offer"]).withMessage("Type must be hero or offer"),
    body("order").optional().isInt().withMessage("Order must be a number")
  ],
  validateRequest,
  createBanner
);

router.put(
  "/:id",
  protectAdmin,
  upload.single("image"),
  [
    param("id").isMongoId().withMessage("Invalid banner id"),
    body("title").optional().notEmpty().withMessage("Title cannot be empty"),
    body("type").optional().isIn(["hero", "offer"]).withMessage("Type must be hero or offer"),
    body("order").optional().isInt().withMessage("Order must be a number")
  ],
  validateRequest,
  updateBanner
);

router.delete(
  "/:id",
  protectAdmin,
  [param("id").isMongoId().withMessage("Invalid banner id")],
  validateRequest,
  deleteBanner
);

router.patch(
  "/:id/toggle",
  protectAdmin,
  [param("id").isMongoId().withMessage("Invalid banner id")],
  validateRequest,
  toggleBannerStatus
);

router.patch(
  "/:id/order",
  protectAdmin,
  [
    param("id").isMongoId().withMessage("Invalid banner id"),
    body("order").isInt().withMessage("Order must be a number")
  ],
  validateRequest,
  updateBannerOrder
);

export default router;
