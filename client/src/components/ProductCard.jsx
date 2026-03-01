import { Link } from "react-router-dom";
import { calculatePricing, formatINR, formatINRWhole } from "../utils/pricing";
import { createSingleProductWhatsAppLink } from "../utils/whatsapp";

const getOfferLabel = (discount) => {
  if (discount >= 40) return "Mega Offer";
  if (discount >= 20) return "Hot Deal";
  return "";
};

const ProductCard = ({ product, index = 0 }) => {
  const discount = Number(product.discount) || 0;
  const hasDiscount = discount > 0;
  const { originalPrice, discountedPrice, savingsAmount } = calculatePricing(product.price, discount);
  const offerLabel = getOfferLabel(discount);

  return (
    <article className="card group overflow-hidden" style={{ animationDelay: `${index * 70}ms` }}>
      <div className="relative overflow-hidden">
        {hasDiscount && (
          <span className="absolute right-3 top-3 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow">
            -{discount}%
          </span>
        )}
        <img
          src={product.images?.[0] || "https://via.placeholder.com/400x280?text=Product"}
          alt={product.name}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold text-slate-900">{product.name}</h3>
          {offerLabel && (
            <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-700">
              {offerLabel}
            </span>
          )}
        </div>

        <div className="text-sm text-slate-600">{product.brand}</div>

        {hasDiscount ? (
          <div className="space-y-1">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-medium text-rose-600">-{discount}%</span>
              <span className="text-3xl font-bold leading-none text-slate-900">
                {formatINRWhole(discountedPrice)}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              M.R.P. <span className="line-through">{formatINRWhole(originalPrice)}</span>
            </p>
            <p className="text-xs font-semibold text-rose-600">Save {formatINR(savingsAmount)}</p>
          </div>
        ) : (
          <span className="text-2xl font-bold text-slate-900">{formatINRWhole(originalPrice)}</span>
        )}

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

        <div className="grid gap-2">
          <a
            href={createSingleProductWhatsAppLink(product, 1)}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-600"
          >
            Buy via WhatsApp
          </a>
        </div>

        <Link
          to={`/products/${product._id}`}
          className="inline-block rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          View Details
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
