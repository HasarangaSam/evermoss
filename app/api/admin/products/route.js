import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";

import { authorized } from "@/lib/auth";

import { uploadImage, deleteImage } from "@/lib/cloudinaryHelpers";
import { normalizeProductImages } from "@/lib/productImageUtils";
import { isProductCategory } from "@/lib/productCategories";

import { revalidateTag } from "next/cache";

// =================================
// CREATE / UPDATE PRODUCT
// =================================

export async function POST(req) {
  try {
    if (!(await authorized(req))) {
      return Response.json(
        {
          error: "Unauthorized. Please login again.",
        },
        {
          status: 401,
        },
      );
    }

    await connectDB();

    const formData = await req.formData();

    const code = formData.get("code")?.trim();

    const name = formData.get("name")?.trim();

    const slug = (formData.get("slug") || name)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const description = formData.get("description")?.trim();

    const category = formData.get("category")?.trim();

    const price = Number(formData.get("price"));

    const customDesign = formData.get("customDesign") === "true";

    if (!code || !name || !description || !price || !category) {
      return Response.json(
        {
          error: "Complete all required fields.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isProductCategory(category)) {
      return Response.json(
        { error: "Please select a valid product category." },
        { status: 400 },
      );
    }

    // Find existing product
    const id = formData.get("_id");

    let oldProduct = null;

    if (id) {
      oldProduct = await Product.findById(id);
    }

    let images = [];

    // Existing images
    const existingImages = formData.getAll("existingImages");
    const oldNormalizedImages = oldProduct
      ? normalizeProductImages(oldProduct.images)
      : [];

    for (const url of existingImages) {
      const existingImage = oldNormalizedImages.find((img) => img?.url === url);

      images.push({
        url,
        publicId: existingImage?.publicId ?? existingImage?.public_id ?? null,
        public_id: existingImage?.public_id ?? existingImage?.publicId ?? null,
      });
    }

    // New uploads
    const files = formData.getAll("images");

    for (const file of files) {
      if (file && typeof file === "object" && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());

        const uploaded = await uploadImage(buffer, "evermoss/products");

        images.push({
          url: uploaded.url,
          publicId: uploaded.publicId,
        });
      }
    }

    if (images.length === 0) {
      return Response.json(
        {
          error: "Please upload at least one image.",
        },
        {
          status: 400,
        },
      );
    }

    images = normalizeProductImages(images).slice(0, 4);

    // Delete old Cloudinary images
    if (oldProduct?.images) {
      const oldNormalizedImages = normalizeProductImages(oldProduct.images);
      const newIds = images
        .map((img) => img.publicId || img.public_id)
        .filter(Boolean);

      for (const oldImg of oldNormalizedImages) {
        const oldPublicId = oldImg.publicId || oldImg.public_id;

        if (oldPublicId && !newIds.includes(oldPublicId)) {
          await deleteImage(oldPublicId);
        }
      }
    }

    const productData = {
      code,

      name,

      slug,

      description,

      category,

      customDesign,

      price,

      image: images[0]?.url || "",

      images,

      updatedAt: new Date(),
    };

    let savedProduct;

    if (id) {
      savedProduct = await Product.findByIdAndUpdate(id, productData, {
        new: true,
      });
    } else {
      savedProduct = await Product.create(productData);
    }

    // Clear cache
    revalidateTag("products");

    if (oldProduct) {
      // clear old slug page
      revalidateTag(`product-${oldProduct.slug}`);
    }

    if (savedProduct?.images) {
      savedProduct.images = normalizeProductImages(savedProduct.images);
    }

    // clear new slug page
    revalidateTag(`product-${slug}`);

    return Response.json({
      ok: true,
    });
  } catch (error) {
    console.error("Save product error:", error);

    return Response.json(
      {
        error: "Database or server error",
      },
      {
        status: 500,
      },
    );
  }
}

// =================================
// DELETE PRODUCT
// =================================

export async function DELETE(req) {
  try {
    if (!(await authorized(req))) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    await connectDB();

    const { id } = await req.json();

    const product = await Product.findById(id);

    if (product?.images) {
      for (const img of normalizeProductImages(product.images)) {
        const publicId = img.publicId || img.public_id;

        if (publicId) {
          await deleteImage(publicId);
        }
      }
    }

    await Product.findByIdAndDelete(id);

    // Clear Next.js cache
    revalidateTag("products");
    if (product) {
      revalidateTag(`product-${product.slug}`);
    }

    return Response.json({
      ok: true,
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return Response.json(
      {
        error: "Database or server error",
      },
      {
        status: 500,
      },
    );
  }
}
