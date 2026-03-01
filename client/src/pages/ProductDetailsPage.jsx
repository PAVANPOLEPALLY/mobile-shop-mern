import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductById } from "../services/api";
import { discountedPrice, formatINR } from "../utils/pricing";
import { createSingleProductWhatsAppLink } from "../utils/whatsapp";

const callNumber = import.meta.env.VITE_CALL_NUMBER || "+919999999999";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    getProductById(id).then(setProduct).catch(console.error);
  }, [id]);

  if (!product) return <p className="animate-fade-in">Loading product details...</p>;

  const finalPrice = discountedPrice(product.price, product.discount);

  return (
    <div className="grid gap-8 lg:grid-cols-2 animate-fade-in">
      <section className="space-y-3 animate-fade-up">
        <img
          src={product.images?.[selectedImage] || "https://via.placeholder.com/700x500?text=Product"}
          alt={product.name}
          className="h-96 w-full rounded-2xl object-cover shadow-md"
        />
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

      <section className="space-y-4 animate-fade-up">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-sm text-slate-600">{product.brand}</p>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-brand-700">{formatINR(finalPrice)}</span>
          {product.discount > 0 && (
            <span className="text-lg text-slate-400 line-through">{formatINR(product.price)}</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-bold">
          {product.discount > 0 && (
            <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700">
              {product.discount}% OFF
            </span>
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

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="rounded-lg bg-brand-500 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-brand-700"
          >
            Add to Cart
          </button>
          <a
            href={createSingleProductWhatsAppLink(product, 1)}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-600"
          >
            Buy via WhatsApp
          </a>
          <a
            href={`tel:${callNumber}`}
            className="rounded-lg bg-slate-800 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
          >
            Call Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsPage;
