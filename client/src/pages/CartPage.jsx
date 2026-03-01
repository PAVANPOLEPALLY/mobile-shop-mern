import { useCart } from "../context/CartContext";
import { discountedPrice, formatINR } from "../utils/pricing";
import { createCartWhatsAppLink } from "../utils/whatsapp";

const CartPage = () => {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (!items.length) {
    return <p className="text-lg font-semibold animate-fade-in">Your cart is empty.</p>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold sm:text-3xl">Shopping Cart</h1>
      <div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
        {items.map((item, index) => {
          const price = discountedPrice(item.price, item.discount);
          return (
            <article
              key={item._id}
              className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center animate-fade-up"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <img
                src={item.images?.[0] || "https://via.placeholder.com/120x120?text=Product"}
                alt={item.name}
                className="h-24 w-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-slate-600">{formatINR(price)} each</p>
                <p className="text-sm font-semibold">Subtotal: {formatINR(price * item.quantity)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center rounded-md border border-slate-300">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-l-md bg-slate-100 text-lg font-semibold text-slate-700 transition hover:bg-slate-200"
                    aria-label={`Decrease quantity for ${item.name}`}
                  >
                    -
                  </button>
                  <span className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-r-md bg-slate-100 text-lg font-semibold text-slate-700 transition hover:bg-slate-200"
                    aria-label={`Increase quantity for ${item.name}`}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="inline-flex min-h-[44px] items-center rounded-md bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between animate-fade-up">
        <h2 className="text-xl font-bold">Total: {formatINR(total)}</h2>
        <a
          href={createCartWhatsAppLink(items)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-600 sm:w-auto"
        >
          Buy All via WhatsApp
        </a>
      </div>
    </div>
  );
};

export default CartPage;
