import express from "express";
import { body } from "express-validator";
import { sendContactEmail } from "../controllers/contactController.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").trim().notEmpty().withMessage("Phone is required"),
    body("message").trim().notEmpty().withMessage("Message is required")
  ],
  validateRequest,
  sendContactEmail
);

export default router;

