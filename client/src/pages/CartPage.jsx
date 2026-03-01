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
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      <div className="space-y-3">
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
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                  className="w-16 rounded-md border border-slate-300 px-2 py-1"
                />
                <button
                  type="button"
                  className="rounded-md bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
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
          className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-600"
        >
          Buy All via WhatsApp
        </a>
      </div>
    </div>
  );
};

export default CartPage;
