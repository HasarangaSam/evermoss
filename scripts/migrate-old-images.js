import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

const { db } = await import("../lib/db.js");
const { uploadImage } = await import("../lib/cloudinaryHelpers.js");

async function migrate() {
  try {
    const database = await db();

    const products = database.collection("products");

    const allProducts = await products.find({}).toArray();

    console.log(`Found ${allProducts.length} products`);

    for (const product of allProducts) {
      console.log("\nMigrating:", product.name);

      // Skip if already migrated
      if (
        product.images?.length &&
        product.images.every((img) => img.publicId)
      ) {
        console.log("Already migrated");
        continue;
      }

      const oldImages = product.images?.length
        ? product.images
        : product.image
          ? [product.image]
          : [];

      if (!oldImages.length) {
        console.log("No images");
        continue;
      }

      const cloudinaryImages = [];

      for (let i = 0; i < oldImages.length; i++) {
        let imageData = oldImages[i];

        // Handle new object format
        if (typeof imageData === "object" && imageData.url) {
          imageData = imageData.url;
        }

        // Skip already Cloudinary URLs
        if (
          typeof imageData === "string" &&
          imageData.includes("cloudinary.com")
        ) {
          console.log(`Skipping existing Cloudinary image ${i + 1}`);

          cloudinaryImages.push({
            url: imageData,
            publicId: oldImages[i].publicId || null,
          });

          continue;
        }

        // Skip invalid images
        if (
          typeof imageData !== "string" ||
          !imageData.startsWith("data:image/")
        ) {
          console.log(`Skipping invalid image ${i + 1}`);
          continue;
        }

        // Convert base64 to buffer
        const base64Data = imageData.split(",")[1];

        const buffer = Buffer.from(base64Data, "base64");

        // Upload to Cloudinary
        const uploaded = await uploadImage(buffer, "evermoss/products");

        cloudinaryImages.push({
          url: uploaded.url,
          publicId: uploaded.publicId,
        });

        console.log(`Uploaded image ${i + 1}`);
      }

      if (cloudinaryImages.length) {
        await products.updateOne(
          {
            _id: product._id,
          },
          {
            $set: {
              images: cloudinaryImages,

              image: cloudinaryImages[0].url,

              updatedAt: new Date(),
            },
          },
        );

        console.log("Updated:", product.name);
      } else {
        console.log("No valid images found for:", product.name);
      }
    }

    console.log("\nMigration completed 🎉");

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);

    process.exit(1);
  }
}

migrate();
