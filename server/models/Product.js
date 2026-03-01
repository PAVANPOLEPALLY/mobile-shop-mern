import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },
    category: {
      type: String,
      enum: ["mobile", "accessory"],
      required: [true, "Category is required"]
    },
    brand: {
      type: String,
      trim: true,
      default: ""
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be positive"]
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [90, "Discount cannot exceed 90"]
    },
    emiAvailable: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      default: ""
    },
    specifications: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    images: {
      type: [String],
      default: []
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"]
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    featuredOrder: {
      type: Number,
      default: 0,
      min: [0, "Featured order cannot be negative"]
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
