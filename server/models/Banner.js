import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true
    },
    subtitle: {
      type: String,
      trim: true,
      default: ""
    },
    image: {
      type: String,
      required: [true, "Banner image is required"]
    },
    type: {
      type: String,
      enum: ["hero", "offer"],
      required: [true, "Banner type is required"]
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    },
    link: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
