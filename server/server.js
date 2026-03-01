import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import "./config/cloudinary.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();
const environment = process.env.NODE_ENV || "development";
const normalizeOrigin = (origin) => (origin || "").trim().replace(/\/+$/, "");
const configuredClientUrls = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => normalizeOrigin(url))
  .filter(Boolean);
const allowedOrigins = ["http://localhost:5173", ...configuredClientUrls].map((url) =>
  normalizeOrigin(url)
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
});

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(normalizeOrigin(origin))) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(xss());
app.use(limiter);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/contact", contactRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Environment: ${environment}`);
  if (environment === "production") {
    console.log("Running in production mode");
  } else {
    console.log("Running in development mode");
  }
  console.log(`Server running on port ${PORT}`);
});
