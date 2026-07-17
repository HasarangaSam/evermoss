export const PRODUCT_CATEGORIES = [
  "Flower Arrangements",
  "Leaf Arrangements",
];

export function isProductCategory(category) {
  return PRODUCT_CATEGORIES.includes(category);
}
