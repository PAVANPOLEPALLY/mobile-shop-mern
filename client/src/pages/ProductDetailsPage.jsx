import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/api";
import { calculatePricing, formatINR, formatINRWhole } from "../utils/pricing";
import { createSingleProductWhatsAppLink } from "../utils/whatsapp";

const callNumber = import.meta.env.VITE_CALL_NUMBER || "+919999999999";

const getOfferLabel = (discount) => {
  if (discount >= 40) return "Mega Offer";
  if (discount >= 20) return "Hot Deal";
  return "";
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    getProductById(id).then(setProduct).catch(console.error);
  }, [id]);

  if (!product) return <p className="animate-fade-in">Loading product details...</p>;

  const discount = Number(product.discount) || 0;
  const hasDiscount = discount > 0;
  const { originalPrice, discountedPrice, savingsAmount } = calculatePricing(product.price, discount);
  const offerLabel = getOfferLabel(discount);

  return (
    <div className="flex flex-col gap-6 lg:flex-row animate-fade-in">
      <section className="w-full space-y-3 animate-fade-up lg:w-1/2">
        <div className="relative">
          {hasDiscount && (
            <span className="absolute right-4 top-4 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow">
              -{discount}%
            </span>
          )}
          <img
            src={product.images?.[selectedImage] || "https://via.placeholder.com/700x500?text=Product"}
            alt={product.name}
            className="h-72 w-full rounded-2xl object-cover shadow-md sm:h-96"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {(product.images || []).map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedImage(index)}
              className={`overflow-hidden rounded-md ring-2 transition ${
                selectedImage === index ? "ring-brand-500" : "ring-transparent hover:ring-brand-200"
              }`}
            >
              <img src={image} alt={product.name} className="h-20 w-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      <section className="w-full space-y-4 animate-fade-up lg:w-1/2">
        <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>
        <p className="text-sm text-slate-600">{product.brand}</p>

        {hasDiscount ? (
          <div className="space-y-1">
            <div className="flex items-end gap-3">
              <span className="text-2xl font-medium text-rose-600 sm:text-3xl">-{discount}%</span>
              <span className="text-3xl font-bold leading-none text-slate-900 sm:text-4xl">
                {formatINRWhole(discountedPrice)}
              </span>
            </div>
            <p className="text-sm text-slate-500">
              M.R.P. <span className="line-through">{formatINRWhole(originalPrice)}</span>
            </p>
            <p className="text-sm font-semibold text-rose-600">You Save {formatINR(savingsAmount)}</p>
          </div>
        ) : (
          <span className="text-3xl font-bold text-slate-900 sm:text-4xl">{formatINRWhole(originalPrice)}</span>
        )}

        <div className="flex flex-wrap gap-2 text-xs font-bold">
          {hasDiscount && (
            <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700">-{discount}% OFF</span>
          )}
          {offerLabel && (
            <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700">{offerLabel}</span>
          )}
          {product.emiAvailable && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
              EMI Available
            </span>
          )}
          <span
            className={`rounded-full px-3 py-1 ${
              product.stock > 0 ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-700"
            }`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>

        <p className="text-slate-700">{product.description}</p>

        <div className="card p-4">
          <h3 className="mb-2 text-lg font-semibold">Specifications</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {(product.specifications || []).map((spec, index) => (
              <li key={`${spec}-${index}`}>{typeof spec === "string" ? spec : JSON.stringify(spec)}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={createSingleProductWhatsAppLink(product, 1)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-green-500 px-5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-600 md:w-auto"
          >
            Buy via WhatsApp
          </a>
          <a
            href={`tel:${callNumber}`}
            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-slate-800 px-5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-900 md:w-auto"
          >
            Call Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsPage;
