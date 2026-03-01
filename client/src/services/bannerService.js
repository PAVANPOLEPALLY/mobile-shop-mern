import api from "./api";

export const getPublicBanners = async (type) => {
  const { data } = await api.get("/banners", { params: type ? { type } : {} });
  return data;
};

export const getAllBannersAdmin = async () => {
  const { data } = await api.get("/banners/admin/all");
  return data;
};

export const createBanner = async (formData) => {
  const { data } = await api.post("/banners", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

export const updateBanner = async (id, formData) => {
  const { data } = await api.put(`/banners/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

export const deleteBanner = async (id) => {
  const { data } = await api.delete(`/banners/${id}`);
  return data;
};

export const toggleBanner = async (id) => {
  const { data } = await api.patch(`/banners/${id}/toggle`);
  return data;
};

export const updateBannerOrder = async (id, order) => {
  const { data } = await api.patch(`/banners/${id}/order`, { order });
  return data;
};
