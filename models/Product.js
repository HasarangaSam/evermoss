import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["Flower Arrangements", "Leaf Arrangements"],
      trim: true,
    },

    customDesign: {
      type: Boolean,
      default: false,
    },

    price: {
      type: Number,
      required: true,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },

        public_id: {
          type: String,
          required: true,
        },
      },
    ],
  },

  {
    timestamps: true,
  },
);

// Next.js keeps Mongoose models alive during development hot reloads. Reuse the
// cached model only when it already has the current schema; otherwise compile
// it again so newly added fields (such as category) are not stripped on save.
if (mongoose.models.Product && !mongoose.models.Product.schema.path("category")) {
  mongoose.deleteModel("Product");
}

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
