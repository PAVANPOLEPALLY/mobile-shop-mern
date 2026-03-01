export const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0);

export const formatINRWhole = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0);

const roundToTwo = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export const calculatePricing = (price, discount) => {
  const originalPrice = roundToTwo(Number(price) || 0);
  const safeDiscount = Math.max(0, Number(discount) || 0);
  const discountedPrice = roundToTwo(originalPrice - (originalPrice * safeDiscount) / 100);
  const savingsAmount = roundToTwo(originalPrice - discountedPrice);

  return {
    originalPrice,
    discountedPrice,
    savingsAmount
  };
};

export const discountedPrice = (price, discount) =>
  calculatePricing(price, discount).discountedPrice;
