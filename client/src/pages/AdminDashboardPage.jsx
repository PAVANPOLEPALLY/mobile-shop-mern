import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  createProduct,
  deleteProduct,
  getProducts,
  toggleFeaturedProduct,
  updateProduct
} from "../services/api";

const initialForm = {
  name: "",
  category: "mobile",
  brand: "",
  price: "",
  discount: "",
  emiAvailable: false,
  isFeatured: false,
  featuredOrder: "0",
  description: "",
  specifications: "",
  stock: "0"
};

const AdminDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState("");
  const [status, setStatus] = useState("");
  const { logout } = useAuth();

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts().catch(console.error);
  }, []);

  const submitLabel = useMemo(() => (editingId ? "Update Product" : "Add Product"), [editingId]);

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const buildFormData = () => {
    const fd = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key === "specifications") {
        const specs = value
          .split("\n")
          .map((spec) => spec.trim())
          .filter(Boolean);
        fd.append(key, JSON.stringify(specs));
      } else if (key === "discount") {
        fd.append(key, value === "" ? "0" : value);
      } else {
        fd.append(key, value);
      }
    });

    Array.from(images).forEach((file) => fd.append("images", file));
    return fd;
  };

  const resetForm = () => {
    setForm(initialForm);
    setImages([]);
    setEditingId("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("Saving product...");

    try {
      const payload = buildFormData();
      if (editingId) {
        await updateProduct(editingId, payload);
        setStatus("Product updated");
      } else {
        await createProduct(payload);
        setStatus("Product created");
      }

      resetForm();
      await loadProducts();
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to save product");
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: String(product.price),
      discount: String(product.discount),
      emiAvailable: product.emiAvailable,
      isFeatured: Boolean(product.isFeatured),
      featuredOrder: String(product.featuredOrder || 0),
      description: product.description,
      specifications: (product.specifications || []).join("\n"),
      stock: String(product.stock)
    });
    setStatus("Editing selected product");
  };

  const handleDelete = async (id) => {
    setStatus("Deleting product...");
    try {
      await deleteProduct(id);
      await loadProducts();
      setStatus("Product deleted");
    } catch (error) {
      setStatus(error.response?.data?.message || "Delete failed");
    }
  };

  const handleToggleFeatured = async (product) => {
    setStatus("Updating featured status...");
    try {
      await toggleFeaturedProduct(product._id, {
        isFeatured: !product.isFeatured,
        featuredOrder: product.featuredOrder || 0
      });
      await loadProducts();
      setStatus("Featured status updated");
    } catch (error) {
      setStatus(error.response?.data?.message || "Featured update failed");
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] animate-fade-in">
      <section className="card p-6 animate-fade-up">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/banners"
              className="rounded-lg bg-brand-100 px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-200"
            >
              Manage Banners
            </Link>
            <button
              type="button"
              className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold transition hover:bg-slate-300"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="Product name"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              name="category"
              value={form.category}
              onChange={handleFormChange}
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500"
            >
              <option value="mobile">Mobile</option>
              <option value="accessory">Accessory</option>
            </select>
            <input
              name="brand"
              value={form.brand}
              onChange={handleFormChange}
              placeholder="Brand"
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Price</label>
              <input
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleFormChange}
                placeholder="Price"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Discount (%)</label>
              <input
                name="discount"
                type="number"
                min="0"
                max="90"
                step="0.01"
                value={form.discount}
                onChange={handleFormChange}
                placeholder="Discount %"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Stock</label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleFormChange}
                placeholder="Stock"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500">Enter discount percentage (0-90). Leave empty for 0.</p>
          <textarea
            name="description"
            value={form.description}
            onChange={handleFormChange}
            rows={3}
            placeholder="Description"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500"
          />
          <textarea
            name="specifications"
            value={form.specifications}
            onChange={handleFormChange}
            rows={4}
            placeholder="Specifications (one per line)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500"
          />
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              name="emiAvailable"
              type="checkbox"
              checked={form.emiAvailable}
              onChange={handleFormChange}
            />
            EMI Available
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                name="isFeatured"
                type="checkbox"
                checked={form.isFeatured}
                onChange={handleFormChange}
              />
              Mark as Featured
            </label>
            <input
              name="featuredOrder"
              type="number"
              min="0"
              value={form.featuredOrder}
              onChange={handleFormChange}
              placeholder="Featured Order"
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500"
            />
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(e.target.files || [])}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
          <div className="flex gap-3">
            <button className="rounded-lg bg-brand-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700">
              {submitLabel}
            </button>
            {editingId && (
              <button
                type="button"
                className="rounded-lg bg-slate-200 px-4 py-3 text-sm font-semibold transition hover:bg-slate-300"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>
          {status && <p className="text-sm text-slate-600">{status}</p>}
        </form>
      </section>

      <section className="space-y-4 animate-fade-up">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <div className="space-y-3">
          {products.map((product, index) => (
            <article
              key={product._id}
              className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center animate-fade-up"
              style={{ animationDelay: `${index * 55}ms` }}
            >
              <img
                src={product.images?.[0] || "https://via.placeholder.com/100x100?text=Image"}
                alt={product.name}
                className="h-20 w-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  {product.isFeatured && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600">
                  {product.category} | {product.brand} | Rs {product.price} | Stock {product.stock}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleFeatured(product)}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    product.isFeatured
                      ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  {product.isFeatured ? "Unfeature" : "Feature"}
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(product)}
                  className="rounded-md bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(product._id)}
                  className="rounded-md bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
