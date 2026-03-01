import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import Product from "../models/Product.js";

const MAX_FEATURED_PRODUCTS = 10;

const uploadSingleImage = (buffer) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "mobile-shop/products",
        transformation: [{ quality: "auto", fetch_format: "auto" }]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

const normalizeSpecifications = (specifications) => {
  if (!specifications) return [];

  if (typeof specifications === "string") {
    try {
      const parsed = JSON.parse(specifications);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return specifications
        .split("\n")
        .map((spec) => spec.trim())
        .filter(Boolean);
    }
  }

  return Array.isArray(specifications) ? specifications : [specifications];
};

const parseBoolean = (value) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return undefined;
};

const normalizeFeaturedOrder = (value, fallback = 0) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const sortFeaturedProducts = (products) => {
  const withOrder = products
    .filter((product) => Number(product.featuredOrder) > 0)
    .sort((a, b) => a.featuredOrder - b.featuredOrder);

  const withoutOrder = products
    .filter((product) => Number(product.featuredOrder) <= 0)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return [...withOrder, ...withoutOrder];
};

const ensureFeaturedLimit = async ({ shouldBeFeatured, excludeProductId }) => {
  if (!shouldBeFeatured) return null;

  const query = { isFeatured: true };
  if (excludeProductId) {
    query._id = { $ne: excludeProductId };
  }

  const featuredCount = await Product.countDocuments(query);
  if (featuredCount >= MAX_FEATURED_PRODUCTS) {
    return `Maximum ${MAX_FEATURED_PRODUCTS} featured products allowed`;
  }

  return null;
};

export const createProduct = async (req, res, next) => {
  try {
    const uploadedUrls = req.files?.length
      ? await Promise.all(req.files.map((file) => uploadSingleImage(file.buffer)))
      : [];

    const parsedFeatured = parseBoolean(req.body.isFeatured);
    if (req.body.isFeatured !== undefined && parsedFeatured === undefined) {
      return res.status(400).json({ message: "isFeatured must be true or false" });
    }

    const featuredError = await ensureFeaturedLimit({
      shouldBeFeatured: parsedFeatured === true
    });
    if (featuredError) {
      return res.status(400).json({ message: featuredError });
    }

    const product = await Product.create({
      ...req.body,
      specifications: normalizeSpecifications(req.body.specifications),
      images: uploadedUrls,
      discount: Number(req.body.discount || 0),
      price: Number(req.body.price),
      stock: Number(req.body.stock || 0),
      emiAvailable: req.body.emiAvailable === "true" || req.body.emiAvailable === true,
      isFeatured: parsedFeatured === true,
      featuredOrder: normalizeFeaturedOrder(req.body.featuredOrder)
    });

    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { category, search, featured } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (featured !== undefined) {
      const parsedFeatured = parseBoolean(featured);
      if (parsedFeatured === undefined) {
        return res.status(400).json({ message: "featured must be true or false" });
      }
      query.isFeatured = parsedFeatured;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    if (query.isFeatured) {
      return res.status(200).json(sortFeaturedProducts(products));
    }

    return res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true });

    return res.status(200).json(sortFeaturedProducts(products));
  } catch (error) {
    return next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    return next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrls = product.images;
    if (req.files?.length) {
      imageUrls = await Promise.all(req.files.map((file) => uploadSingleImage(file.buffer)));
    }

    const parsedFeatured = parseBoolean(req.body.isFeatured);
    if (req.body.isFeatured !== undefined && parsedFeatured === undefined) {
      return res.status(400).json({ message: "isFeatured must be true or false" });
    }

    const shouldBeFeatured = req.body.isFeatured !== undefined ? parsedFeatured : product.isFeatured;
    const featuredError = await ensureFeaturedLimit({
      shouldBeFeatured,
      excludeProductId: req.params.id
    });
    if (featuredError) {
      return res.status(400).json({ message: featuredError });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        specifications: req.body.specifications
          ? normalizeSpecifications(req.body.specifications)
          : product.specifications,
        images: imageUrls,
        discount: req.body.discount !== undefined ? Number(req.body.discount) : product.discount,
        price: req.body.price !== undefined ? Number(req.body.price) : product.price,
        stock: req.body.stock !== undefined ? Number(req.body.stock) : product.stock,
        emiAvailable:
          req.body.emiAvailable !== undefined
            ? req.body.emiAvailable === "true" || req.body.emiAvailable === true
            : product.emiAvailable,
        isFeatured: req.body.isFeatured !== undefined ? parsedFeatured : product.isFeatured,
        featuredOrder:
          req.body.featuredOrder !== undefined
            ? normalizeFeaturedOrder(req.body.featuredOrder, product.featuredOrder)
            : product.featuredOrder
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
};

export const toggleProductFeatured = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const parsedFeatured = parseBoolean(req.body.isFeatured);
    const nextFeaturedStatus =
      req.body.isFeatured !== undefined ? parsedFeatured : !product.isFeatured;

    if (nextFeaturedStatus === undefined) {
      return res.status(400).json({ message: "isFeatured must be true or false" });
    }

    const featuredError = await ensureFeaturedLimit({
      shouldBeFeatured: nextFeaturedStatus,
      excludeProductId: req.params.id
    });
    if (featuredError) {
      return res.status(400).json({ message: featuredError });
    }

    product.isFeatured = nextFeaturedStatus;
    if (req.body.featuredOrder !== undefined) {
      product.featuredOrder = normalizeFeaturedOrder(req.body.featuredOrder, product.featuredOrder);
    } else if (!product.isFeatured) {
      product.featuredOrder = 0;
    }

    const updated = await product.save();
    return res.status(200).json(updated);
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

export const uploadProductImages = async (req, res, next) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ message: "No images provided" });
    }

    const uploadedUrls = await Promise.all(req.files.map((file) => uploadSingleImage(file.buffer)));
    return res.status(200).json({ urls: uploadedUrls });
  } catch (error) {
    return next(error);
  }
};
