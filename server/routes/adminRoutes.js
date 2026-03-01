import express from "express";
import { body } from "express-validator";
import { loginAdmin } from "../controllers/adminController.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars")
  ],
  validateRequest,
  loginAdmin
);

export default router;
