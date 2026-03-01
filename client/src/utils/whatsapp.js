import { discountedPrice, formatINR } from "./pricing";

const DEFAULT_WHATSAPP_NUMBER = "919999999999";

export const normalizeWhatsAppNumber = (value) => {
  const digits = String(value || "").replace(/\D/g, "");

  if (!digits) return DEFAULT_WHATSAPP_NUMBER;
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.length === 10) return `91${digits}`;
  if (digits.length >= 11 && digits.length <= 15) return digits;

  return DEFAULT_WHATSAPP_NUMBER;
};

export const whatsappNumber = normalizeWhatsAppNumber(
  import.meta.env.VITE_WHATSAPP_NUMBER || import.meta.env.VITE_CALL_NUMBER
);

export const createWhatsAppLink = (message = "") =>
  `https://wa.me/${whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

export const createSingleProductWhatsAppLink = (product, quantity = 1) => {
  const finalPrice = discountedPrice(product.price, product.discount);
  const total = finalPrice * quantity;

  const message = `Hello, I want to order:\n\nProduct Name: ${product.name}\nPrice: ${formatINR(finalPrice)}\nQuantity: ${quantity}\n\nTotal Amount: ${formatINR(total)}`;

  return createWhatsAppLink(message);
};

export const createCartWhatsAppLink = (items) => {
  const lines = items.map((item) => {
    const finalPrice = discountedPrice(item.price, item.discount);
    return `Product Name: ${item.name}\nPrice: ${formatINR(finalPrice)}\nQuantity: ${item.quantity}`;
  });

  const total = items.reduce(
    (sum, item) => sum + discountedPrice(item.price, item.discount) * item.quantity,
    0
  );

  const message = `Hello, I want to order:\n\n${lines.join("\n\n")}\n\nTotal Amount: ${formatINR(total)}`;
  return createWhatsAppLink(message);
};
