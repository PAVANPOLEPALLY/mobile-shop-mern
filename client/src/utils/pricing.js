export const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value || 0);

export const discountedPrice = (price, discount) =>
  Math.round((Number(price) || 0) * (1 - (Number(discount) || 0) / 100));
