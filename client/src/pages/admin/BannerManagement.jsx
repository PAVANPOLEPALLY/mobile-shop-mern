import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  createBanner,
  deleteBanner,
  getAllBannersAdmin,
  toggleBanner,
  updateBanner,
  updateBannerOrder
} from "../../services/bannerService";

const initialForm = {
  title: "",
  subtitle: "",
  type: "hero",
  order: "0",
  link: "",
  isActive: true
};

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState("");
  const [status, setStatus] = useState("");

  const submitLabel = useMemo(() => (editingId ? "Update Banner" : "Add Banner"), [editingId]);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await getAllBannersAdmin();
      setBanners(data);
    } catch {
      setStatus("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setImage(null);
    setEditingId("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("Saving banner...");

    if (!editingId && !image) {
      setStatus("Image is required");
      return;
    }

    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("subtitle", form.subtitle);
    payload.append("type", form.type);
    payload.append("order", form.order || "0");
    payload.append("link", form.link);
    payload.append("isActive", String(form.isActive));
    if (image) payload.append("image", image);

    try {
      if (editingId) {
        await updateBanner(editingId, payload);
        setStatus("Banner updated");
      } else {
        await createBanner(payload);
        setStatus("Banner created");
      }

      resetForm();
      await loadBanners();
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to save banner");
    }
  };

  const startEdit = (banner) => {
    setEditingId(banner._id);
    setForm({
      title: banner.title,
      subtitle: banner.subtitle || "",
      type: banner.type,
      order: String(banner.order ?? 0),
      link: banner.link || "",
      isActive: banner.isActive
    });
    setImage(null);
    setStatus("Editing banner");
  };

  const handleDelete = async (id) => {
    setStatus("Deleting banner...");
    try {
      await deleteBanner(id);
      await loadBanners();
      setStatus("Banner deleted");
    } catch (error) {
      setStatus(error.response?.data?.message || "Delete failed");
    }
  };

  const handleToggle = async (id) => {
    setStatus("Updating status...");
    try {
      await toggleBanner(id);
      await loadBanners();
      setStatus("Status updated");
    } catch {
      setStatus("Failed to toggle banner");
    }
  };

  const handleOrderUpdate = async (id, order) => {
    try {
      await updateBannerOrder(id, Number(order));
      await loadBanners();
      setStatus("Order updated");
    } catch {
      setStatus("Failed to update order");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">Banner Management</h1>
        <Link
          to="/admin/dashboard"
          className="inline-flex min-h-[44px] items-center rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold transition hover:bg-slate-300"
        >
          Back to Dashboard
        </Link>
      </div>

      <section className="card p-6">
        <h2 className="mb-4 text-xl font-bold">Add / Edit Banner</h2>
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="rounded-lg border border-slate-300 px-3 py-3 min-h-[44px]"
          />
          <input
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            placeholder="Subtitle"
            className="rounded-lg border border-slate-300 px-3 py-3 min-h-[44px]"
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="rounded-lg border border-slate-300 px-3 py-3 min-h-[44px]"
          >
            <option value="hero">Hero</option>
            <option value="offer">Offer</option>
          </select>
          <input
            name="order"
            type="number"
            value={form.order}
            onChange={handleChange}
            placeholder="Order"
            className="rounded-lg border border-slate-300 px-3 py-3 min-h-[44px]"
          />
          <input
            name="link"
            value={form.link}
            onChange={handleChange}
            placeholder="Redirect Link (optional)"
            className="rounded-lg border border-slate-300 px-3 py-3 min-h-[44px]"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="rounded-lg border border-slate-300 px-3 py-3 min-h-[44px]"
          />

          <label className="col-span-full flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} />
            Active
          </label>

          <div className="col-span-full flex flex-wrap gap-3">
            <button className="inline-flex min-h-[44px] items-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700">
              {submitLabel}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex min-h-[44px] items-center rounded-lg bg-slate-200 px-4 py-3 text-sm font-semibold transition hover:bg-slate-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {status && <p className="mt-3 text-sm text-slate-600">{status}</p>}
      </section>

      <section className="card p-6">
        <h2 className="mb-4 text-xl font-bold">Banner List</h2>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-lg bg-slate-200" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="px-2 py-2">Image</th>
                  <th className="px-2 py-2">Title</th>
                  <th className="px-2 py-2">Type</th>
                  <th className="px-2 py-2">Order</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner._id} className="border-b border-slate-100">
                    <td className="px-2 py-3">
                      <img src={banner.image} alt={banner.title} className="h-14 w-24 rounded object-cover" />
                    </td>
                    <td className="px-2 py-3">
                      <p className="font-semibold">{banner.title}</p>
                      {banner.subtitle && <p className="text-xs text-slate-500">{banner.subtitle}</p>}
                    </td>
                    <td className="px-2 py-3">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                        {banner.type}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <input
                        type="number"
                        defaultValue={banner.order}
                        onBlur={(event) => handleOrderUpdate(banner._id, event.target.value)}
                        className="w-20 rounded border border-slate-300 px-2 py-1"
                      />
                    </td>
                    <td className="px-2 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          banner.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {banner.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(banner)}
                          className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggle(banner._id)}
                          className="rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700"
                        >
                          Toggle
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(banner._id)}
                          className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default BannerManagement;
