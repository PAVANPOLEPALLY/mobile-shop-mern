const key = "mobileShopCart";

export const getStoredCart = () => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

export const setStoredCart = (cart) => {
  localStorage.setItem(key, JSON.stringify(cart));
};
