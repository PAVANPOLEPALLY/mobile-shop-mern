import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import Banner from "../models/Banner.js";

const uploadBannerImage = (buffer) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "mobile-shop/banners",
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

const extractPublicId = (url) => {
  if (!url || typeof url !== "string") return "";
  const marker = "/upload/";
  const markerIndex = url.indexOf(marker);
  if (markerIndex === -1) return "";
  let path = url.substring(markerIndex + marker.length);
  path = path.replace(/^v\d+\//, "");
  const dotIndex = path.lastIndexOf(".");
  if (dotIndex !== -1) {
    path = path.substring(0, dotIndex);
  }
  return path;
};

const toBoolean = (value, defaultValue = true) => {
  if (value === undefined || value === null || value === "") return defaultValue;
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true";
};

export const getActiveBanners = async (req, res, next) => {
  try {
    const { type } = req.query;
    const query = { isActive: true };

    if (type) {
      query.type = type;
    }

    const banners = await Banner.find(query).sort({ order: 1, createdAt: -1 });
    return res.status(200).json(banners);
  } catch (error) {
    return next(error);
  }
};

export const getAllBannersAdmin = async (req, res, next) => {
  try {
    const banners = await Banner.find({}).sort({ order: 1, createdAt: -1 });
    return res.status(200).json(banners);
  } catch (error) {
    return next(error);
  }
};

export const createBanner = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Banner image is required" });
    }

    const image = await uploadBannerImage(req.file.buffer);

    const banner = await Banner.create({
      title: req.body.title,
      subtitle: req.body.subtitle || "",
      type: req.body.type,
      image,
      isActive: toBoolean(req.body.isActive, true),
      order: Number(req.body.order || 0),
      link: req.body.link || ""
    });

    return res.status(201).json(banner);
  } catch (error) {
    return next(error);
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    let imageUrl = banner.image;

    if (req.file) {
      imageUrl = await uploadBannerImage(req.file.buffer);

      const oldPublicId = extractPublicId(banner.image);
      if (oldPublicId) {
        cloudinary.uploader.destroy(oldPublicId).catch(() => {});
      }
    }

    banner.title = req.body.title ?? banner.title;
    banner.subtitle = req.body.subtitle ?? banner.subtitle;
    banner.type = req.body.type ?? banner.type;
    banner.isActive = toBoolean(req.body.isActive, banner.isActive);
    banner.order =
      req.body.order !== undefined && req.body.order !== ""
        ? Number(req.body.order)
        : banner.order;
    banner.link = req.body.link ?? banner.link;
    banner.image = imageUrl;

    await banner.save();
    return res.status(200).json(banner);
  } catch (error) {
    return next(error);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    const publicId = extractPublicId(banner.image);
    if (publicId) {
      cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    await banner.deleteOne();
    return res.status(200).json({ message: "Banner deleted" });
  } catch (error) {
    return next(error);
  }
};

export const toggleBannerStatus = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    return res.status(200).json(banner);
  } catch (error) {
    return next(error);
  }
};

export const updateBannerOrder = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    banner.order = Number(req.body.order);
    await banner.save();

    return res.status(200).json(banner);
  } catch (error) {
    return next(error);
  }
};
