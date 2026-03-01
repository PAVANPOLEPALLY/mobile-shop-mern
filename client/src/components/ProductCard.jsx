import { Link } from "react-router-dom";
import { discountedPrice, formatINR } from "../utils/pricing";

const ProductCard = ({ product, index = 0 }) => {
  const finalPrice = discountedPrice(product.price, product.discount);

  return (
    <article className="card group overflow-hidden" style={{ animationDelay: `${index * 70}ms` }}>
      <div className="overflow-hidden">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/400x280?text=Product"}
          alt={product.name}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold text-slate-900">{product.name}</h3>
          {product.discount > 0 && (
            <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-bold text-rose-700">
              {product.discount}% OFF
            </span>
          )}
        </div>

        <div className="text-sm text-slate-600">{product.brand}</div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-brand-700">{formatINR(finalPrice)}</span>
          {product.discount > 0 && (
            <span className="text-sm text-slate-400 line-through">{formatINR(product.price)}</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {product.emiAvailable && (
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">EMI</span>
          )}
          <span
            className={`rounded-full px-2 py-1 ${
              product.stock > 0 ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600"
            }`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>

        <Link
          to={`/products/${product._id}`}
          className="inline-block rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-700"
        >
          View Details
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
