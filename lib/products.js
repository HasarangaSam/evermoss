import { db } from "./db";
export const starterProducts = [
  {
    slug: "daisy",
    code: "EM-004",
    name: "Daisy",
    price: 3900,
    description:
      "A little bloom can brighten an entire space.\n\nDaisy brings a soft touch of colour and a peaceful charm to coffee tables, shelves, and your favourite little corners.",
    customDesign: true,
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=85",
  },
  {
    slug: "bella-family",
    code: "EM-005",
    name: "Bella Family",
    price: 4500,
    description:
      "Say hello to the Bella family.\n\nThree handcrafted bicycle arrangements, each with its own little charm: Pink, Cream and Red. Which one feels most like you?",
    customDesign: true,
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1000&q=85",
  },
  {
    slug: "amber",
    code: "EM-014",
    name: "Amber",
    price: 4900,
    description:
      "Warm colours. Timeless charm.\n\nAmber’s coral roses are arranged to bring a welcoming touch to homes filled with love and beautiful little details.",
    customDesign: true,
    image:
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1000&q=85",
  },
];
export async function getProducts() {
  try {
    const items = await (await db())
      .collection("products")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return items.length ? JSON.parse(JSON.stringify(items)) : starterProducts;
  } catch {
    return starterProducts;
  }
}
export async function getProduct(slug) {
  return (await getProducts()).find((p) => p.slug === slug);
}
