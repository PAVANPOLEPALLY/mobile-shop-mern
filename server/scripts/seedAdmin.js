import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required in .env");
    }

    const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL.toLowerCase() });

    if (existing) {
      existing.password = process.env.ADMIN_PASSWORD;
      existing.role = "admin";
      await existing.save();
      console.log("Admin already existed. Password updated from .env");
      process.exit(0);
    }

    await Admin.create({
      email: process.env.ADMIN_EMAIL.toLowerCase(),
      password: process.env.ADMIN_PASSWORD,
      role: "admin"
    });

    console.log("Admin seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seedAdmin();
