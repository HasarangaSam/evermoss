import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";

import { authorized } from "@/lib/auth";

import { uploadImage, deleteImage } from "@/lib/cloudinaryHelpers";

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

    const price = Number(formData.get("price"));

    const customDesign = formData.get("customDesign") === "true";

    if (!code || !name || !description || !price) {
      return Response.json(
        {
          error: "Complete all required fields.",
        },
        {
          status: 400,
        },
      );
    }

    // Find existing product
    const oldProduct = await Product.findOne({
      slug,
    });

    let images = [];

    // Existing images
    const existingImages = formData.getAll("existingImages");

    for (const url of existingImages) {
      images.push({
        url,
        publicId: null,
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

    images = images.slice(0, 4);

    // Delete old Cloudinary images
    if (oldProduct?.images) {
      const newIds = images.map((img) => img.publicId).filter(Boolean);

      for (const oldImg of oldProduct.images) {
        if (oldImg.publicId && !newIds.includes(oldImg.publicId)) {
          await deleteImage(oldImg.publicId);
        }
      }
    }

    const productData = {
      code,

      name,

      slug,

      description,

      customDesign,

      price,

      image: images[0]?.url || "",

      images,

      updatedAt: new Date(),
    };

    await Product.findOneAndUpdate(
      {
        slug,
      },

      productData,

      {
        upsert: true,
        new: true,
      },
    );

    // Clear Next.js cache
    revalidateTag("products");
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

    const { slug } = await req.json();

    const product = await Product.findOne({
      slug,
    });

    if (product?.images) {
      for (const img of product.images) {
        if (img.publicId) {
          await deleteImage(img.publicId);
        }
      }
    }

    await Product.deleteOne({
      slug,
    });

    // Clear Next.js cache
    revalidateTag("products");
    revalidateTag(`product-${slug}`);

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
