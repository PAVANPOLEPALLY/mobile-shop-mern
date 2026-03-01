import { discountedPrice, formatINR } from "./pricing";

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "778039932";

export const createSingleProductWhatsAppLink = (product, quantity = 1) => {
  const finalPrice = discountedPrice(product.price, product.discount);
  const total = finalPrice * quantity;

  const message = `Hello, I want to order:\n\nProduct Name: ${product.name}\nPrice: ${formatINR(finalPrice)}\nQuantity: ${quantity}\n\nTotal Amount: ${formatINR(total)}`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
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
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};
