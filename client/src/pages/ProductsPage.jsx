import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/api";
import { discountedPrice } from "../utils/pricing";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error);
  }, []);

  const matchesPriceFilter = (product) => {
    if (!priceFilter) return true;

    const finalPrice = discountedPrice(product.price, product.discount);

    if (priceFilter === "below-5000") return finalPrice < 5000;
    if (priceFilter === "below-10000") return finalPrice < 10000;
    if (priceFilter === "below-20000") return finalPrice < 20000;
    if (priceFilter === "above-20000") return finalPrice > 20000;
    return true;
  };

  const filtered = useMemo(() => {
    const filteredItems = products.filter((product) => {
      const matchesCategory = category ? product.category === category : true;
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesPrice = matchesPriceFilter(product);
      return matchesCategory && matchesSearch && matchesPrice;
    });

    if (sortBy === "price-low-high") {
      return [...filteredItems].sort(
        (a, b) => discountedPrice(a.price, a.discount) - discountedPrice(b.price, b.discount)
      );
    }

    return filteredItems;
  }, [products, category, search, priceFilter, sortBy]);

  const clearFilters = () => {
    setCategory("");
    setSearch("");
    setPriceFilter("");
    setSortBy("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">All Products</h1>

      <div className="card grid gap-4 p-4 animate-fade-up sm:grid-cols-2 lg:grid-cols-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product name"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500 sm:col-span-2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500"
        >
          <option value="">All Categories</option>
          <option value="mobile">Mobile</option>
          <option value="accessory">Accessory</option>
        </select>

        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500"
        >
          <option value="">All Prices</option>
          <option value="below-5000">Below ₹5,000</option>
          <option value="below-10000">Below ₹10,000</option>
          <option value="below-20000">Below ₹20,000</option>
          <option value="above-20000">Above ₹20,000</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-brand-500"
        >
          <option value="">Sort By</option>
          <option value="price-low-high">Price (Low to High)</option>
        </select>

        <button
          type="button"
          onClick={clearFilters}
          className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300 sm:col-span-2 lg:col-span-1"
        >
          Clear Filters
        </button>
      </div>

      {filtered.length ? (
        <div className="stagger-grid grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-white p-6 text-center text-slate-600 ring-1 ring-slate-200">
          No products found for selected filters.
        </p>
      )}
    </div>
  );
};

export default ProductsPage;
