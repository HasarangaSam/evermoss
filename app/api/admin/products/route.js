import { db } from "@/lib/db";
import { authorized } from "@/lib/auth";
import { uploadImage, deleteImage } from "@/lib/cloudinaryHelpers";

// ===============================
// CREATE / UPDATE PRODUCT
// ===============================

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

    const collection = (await db()).collection("products");

    const oldProduct = await collection.findOne({
      slug,
    });

    let images = [];

    // ===============================
    // Existing Cloudinary Images
    // ===============================

    const existingImages = formData.getAll("existingImages");

    for (const url of existingImages) {
      images.push({
        url,
        publicId: null,
      });
    }

    // ===============================
    // New Uploads
    // ===============================

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

    // ===============================
    // Delete replaced images
    // ===============================

    if (oldProduct?.images) {
      const newIds = images.map((img) => img.publicId).filter(Boolean);

      for (const oldImg of oldProduct.images) {
        if (oldImg.publicId && !newIds.includes(oldImg.publicId)) {
          await deleteImage(oldImg.publicId);
        }
      }
    }

    const product = {
      code,

      name,

      slug,

      description,

      customDesign,

      price,

      // backwards compatibility

      image: images[0]?.url || "",

      images,

      updatedAt: new Date(),
    };

    await collection.updateOne(
      {
        slug,
      },

      {
        $set: product,

        $setOnInsert: {
          createdAt: new Date(),
        },
      },

      {
        upsert: true,
      },
    );

    return Response.json({
      ok: true,
    });
  } catch (error) {
    console.error("Failed to save product:", error);

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

// ===============================
// DELETE PRODUCT
// ===============================

export async function DELETE(req) {
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

    const { slug } = await req.json();

    const collection = (await db()).collection("products");

    const product = await collection.findOne({
      slug,
    });

    if (product?.images) {
      for (const img of product.images) {
        if (img.publicId) {
          await deleteImage(img.publicId);
        }
      }
    }

    await collection.deleteOne({
      slug,
    });

    return Response.json({
      ok: true,
    });
  } catch (error) {
    console.error("Failed to delete product:", error);

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
