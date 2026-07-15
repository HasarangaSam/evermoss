import { unstable_cache } from "next/cache";

import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";

function serializeProduct(product) {
  return {
    ...product,

    _id: product._id?.toString(),

    createdAt: product.createdAt ? product.createdAt.toISOString() : null,

    updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,

    images: (product.images || []).map((img) => ({
      url: img.url,
      publicId: img.publicId || null,
    })),
  };
}

// ===============================
// ALL PRODUCTS
// ===============================

export async function getProducts() {
  return unstable_cache(
    async () => {
      await connectDB();

      const products = await Product.find()
        .sort({
          createdAt: -1,
        })
        .lean();

      return products.map(serializeProduct);
    },

    ["products-list"],

    {
      revalidate: 300,

      tags: ["products"],
    },
  )();
}

// ===============================
// SINGLE PRODUCT
// ===============================

export async function getProduct(slug) {
  return unstable_cache(
    async () => {
      await connectDB();

      const product = await Product.findOne({
        slug,
      }).lean();

      if (!product) {
        return null;
      }

      return serializeProduct(product);
    },

    [`product-${slug}`],

    {
      revalidate: 300,

      tags: [`product-${slug}`],
    },
  )();
}
