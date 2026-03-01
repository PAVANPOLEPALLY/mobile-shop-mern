import axios from "axios";

const normalizeBaseUrl = (value) => (value || "").trim().replace(/\/+$/, "");
const rawBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
const baseURL = rawBaseUrl ? (rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`) : "/api";

const api = axios.create({
  baseURL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getProducts = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return data;
};

export const getFeaturedProducts = async () => {
  const { data } = await api.get("/products/featured");
  return data;
};

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const loginAdmin = async (credentials) => {
  const { data } = await api.post("/admin/login", credentials);
  return data;
};

export const createProduct = async (formData) => {
  const { data } = await api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

export const updateProduct = async (id, formData) => {
  const { data } = await api.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

export const toggleFeaturedProduct = async (id, payload = {}) => {
  const { data } = await api.patch(`/products/${id}/featured`, payload);
  return data;
};

export const sendContactEnquiry = async (payload) => {
  const { data } = await api.post("/contact", payload);
  return data;
};

export default api;
