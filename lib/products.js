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

export async function getProducts() {
  await connectDB();

  const products = await Product.find()
    .sort({
      createdAt: -1,
    })
    .lean();

  return products.map(serializeProduct);
}

export async function getProduct(slug) {
  await connectDB();

  const product = await Product.findOne({
    slug,
  }).lean();

  if (!product) return null;

  return serializeProduct(product);
}
